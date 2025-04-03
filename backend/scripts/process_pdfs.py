# backend/scripts/process_pdfs.py
import sys
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import pickle

def main():
    if len(sys.argv) < 3:
        print("Usage: python process_pdfs.py <session_id> <pdf_path1> <pdf_path2> ...")
        sys.exit(1)
    
    session_id = sys.argv[1]
    pdf_paths = sys.argv[2:]
    
    print(f"Processing {len(pdf_paths)} PDFs for session {session_id}")
    
    # Set up embeddings
    os.environ['HF_TOKEN'] = os.getenv('HF_TOKEN')   # Replace with actual token or get from env var
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Load documents
    documents = []
    for pdf_path in pdf_paths:
        print(f"Loading {pdf_path}")
        loader = PyPDFLoader(pdf_path)
        docs = loader.load()
        documents.extend(docs)
    
    # Split documents
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
    splits = text_splitter.split_documents(documents)
    
    # Create vector store
    db_directory = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'vector_db', session_id)
    os.makedirs(db_directory, exist_ok=True)
    
    vectorstore = Chroma.from_documents(
        documents=splits, 
        embedding=embeddings,
        persist_directory=db_directory
    )
    vectorstore.persist()
    
    # Save session info
    session_info = {
        'pdf_paths': pdf_paths,
        'document_count': len(documents),
        'chunk_count': len(splits)
    }
    
    with open(os.path.join(db_directory, 'session_info.pkl'), 'wb') as f:
        pickle.dump(session_info, f)
    
    print(f"Successfully processed {len(documents)} documents and created {len(splits)} chunks for session {session_id}")

if __name__ == "__main__":
    main()