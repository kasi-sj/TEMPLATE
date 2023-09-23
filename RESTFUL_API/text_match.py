import gensim
from gensim.models import Word2Vec
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
training_data = [
    "12/03/2022 paracetamol 10rs",
    "12/03/2022 aspirin 5rs",
    "12/03/2022 ibuprofen 8rs",
    "03/04/2022 cough syrup 15rs",
    "03/04/2022 antibiotics 12rs",
    "03/04/2022 painkillers 7rs",
    "09/12/2022 bandages 3rs",
    "09/12/2022 vitamins 9rs",
    "09/12/2022 antacids 6rs",
    "09/12/2022 thermometer 2rs",
]
query_sentences = [
    "12/03/2022 paracetamol 10rs",
    "12/03/2022 ibuprofen 8rs",
    "03/04/2022 antibiotics 12rs",
    "03/04/2022 amilodofin 50rs",  
]
print()
print()
print("training_data")
for i in training_data:
    print(i)
print()
print()
print("query_sentence")
for i in query_sentences:
    print(i)
tokenized_training_data = [sentence.lower().split() for sentence in training_data]
tokenized_queries = [query.lower().split() for query in query_sentences]
model = Word2Vec(sentences=tokenized_training_data, vector_size=100, window=5, min_count=1, sg=0)
for i in range(2):
    print()
def sentence_embedding(sentence, model):
    words = sentence.split()
    valid_words = [word for word in words if word in model.wv]
    if not valid_words:
        return None
    word_vectors = [model.wv[word] for word in valid_words]
    return np.mean(word_vectors, axis=0)
for query_sentence in query_sentences:
    query_embedding = sentence_embedding(query_sentence, model)
    if query_embedding is not None:
        similarities = [cosine_similarity([query_embedding], [sentence_embedding(sentence, model)])[0][0]
                        if sentence_embedding(sentence, model) is not None else -1 for sentence in training_data]
        most_similar_index = np.argmax(similarities)
        if(similarities[most_similar_index] > .6):
            print(f"Query Sentence: {query_sentence}")
            print(f"Most Similar Sentence: {training_data[most_similar_index]}")
            print(f"Cosine Similarity Score: {similarities[most_similar_index]}\n")
        else:
            print(f"Query sentence '{query_sentence}' has no valid words.\n")
    else:
        print(f"Query sentence '{query_sentence}' has no valid words.\n")