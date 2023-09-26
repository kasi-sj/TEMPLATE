import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import pairwise_distances
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer

nltk.download('punkt')  # Download the punkt tokenizer for Jaccard similarity

def cosine_similarity_score(text1, text2):
    # Tokenize the text and calculate cosine similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    return cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]

def jaccard_similarity_score(text1, text2):
    # Tokenize the text and calculate Jaccard similarity
    tokens1 = set(nltk.word_tokenize(text1.lower()))
    tokens2 = set(nltk.word_tokenize(text2.lower()))
    intersection = len(tokens1.intersection(tokens2))
    union = len(tokens1) + len(tokens2) - intersection
    return intersection / union

def euclidean_distance_score(text1, text2):
    # Tokenize the text and calculate Euclidean distance
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    return pairwise_distances(tfidf_matrix, metric='euclidean')[0][1]
