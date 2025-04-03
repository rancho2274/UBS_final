# backend/scripts/answer_question.py
import sys
import os
import pickle
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_chroma import Chroma
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_huggingface import HuggingFaceEmbeddings
import json

def main():
    if len(sys.argv) != 3:
        print("Usage: python answer_question.py <session_id> <question>")
        sys.exit(1)
    
    session_id = sys.argv[1]
    question = sys.argv[2]
    
    # Set up OpenAI API key (ideally should be passed as an environment variable)
    os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')  # Replace with actual API key or get from env var
    
    # Set up embeddings
    os.environ['HF_TOKEN'] = os.getenv('HF_TOKEN')   # Replace with actual token or get from env var
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Load vectorstore
    db_directory = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'vector_db', session_id)
    
    if not os.path.exists(db_directory):
        print(f"No vector database found for session {session_id}")
        sys.exit(1)
    
    vectorstore = Chroma(persist_directory=db_directory, embedding_function=embeddings)
    retriever = vectorstore.as_retriever()
    
    # Set up LLM
    llm = ChatOpenAI(model_name="gpt-4o")
    
    # Get chat history file path
    history_file = os.path.join(db_directory, 'chat_history.json')
    
    # Load or create chat history
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            history_data = json.load(f)
        
        chat_history = ChatMessageHistory()
        for msg in history_data:
            if msg['type'] == 'human':
                chat_history.add_user_message(msg['content'])
            elif msg['type'] == 'ai':
                chat_history.add_ai_message(msg['content'])
    else:
        chat_history = ChatMessageHistory()
    
    # Set up context-aware retriever
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    
    # Set up QA chain
    system_prompt = (
        "You are an educational assistant that helps students understand "
        "learning materials. Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Use clear explanations that would help a student understand. "
        "If appropriate, give examples to illustrate concepts."
        "\n\n"
        "{context}"
    )
    
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    
    # Get session-specific history manager
    chat_store = {session_id: chat_history}
    
    def get_session_history(session):
        return chat_store.get(session, ChatMessageHistory())
    
    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer"
    )
    
    # Get answer
    response = conversational_rag_chain.invoke(
        {"input": question},
        config={"configurable": {"session_id": session_id}}
    )
    
    # Update chat history
    chat_history.add_user_message(question)
    chat_history.add_ai_message(response['answer'])
    
    # Save updated chat history
    history_data = []
    for message in chat_history.messages:
        if message.type == "human":
            history_data.append({"type": "human", "content": message.content})
        else:
            history_data.append({"type": "ai", "content": message.content})
    
    with open(history_file, 'w') as f:
        json.dump(history_data, f)
    
    # Print the answer (will be captured by the Node.js process)
    print(response['answer'])

if __name__ == "__main__":
    main()