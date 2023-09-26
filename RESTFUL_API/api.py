from flask import Flask, jsonify, request , send_file
import os
import io
from PIL import Image
import imageToText
import matplotlib as plt
import numpy as np
import cv2
import base64
import requests
import text_match
import templateComparation
import similarImage
app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
sample_data =[]

@app.route('/api/scan', methods=['POST'])
def handle_scan():
    print('request received')
    try:
        data  = request.get_json()
        data_bytes = bytes(data['file']['data'])
        data = imageToText.convert(data_bytes)
        return jsonify(data), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400



@app.route('/')
def get():
    return "Hi"

@app.route('/api/match', methods=['POST'])
def handle_match():
    print('request received')
    try:
        data = request.get_json()
        base64_encoded_image = data['file']['data']
        template = data['file']['template']
        image_bytes = base64.b64decode(base64_encoded_image)
        response = requests.get(template)
        template_bytes = None
        if response.status_code == 200:
            template_data = response.content
            base64_encoded_template = base64.b64encode(template_data).decode('utf-8')
            template_bytes = base64.b64decode(base64_encoded_template)
        else:
            return jsonify({'error': str(e)}), 400
        result_dict = templateComparation.compare_images(image_bytes, template_bytes)

        return jsonify(result_dict), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400



@app.route('/api/similar', methods=['POST'])
def handle_similar():
    try:
        data = request.get_json()
        base64_encoded_image = data['file']['data']
        image_bytes = base64.b64decode(base64_encoded_image)
        result_dict = similarImage.query_pinecone_with_image_data(image_bytes)
        l=[]
        for i in result_dict:
            l.append({'id':i['id'],'score':i['score']})
        response_dict = {'similar': l}
        return jsonify(response_dict), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400
    

@app.route('/api/similarText', methods=['POST'])
def handle_similarText():
    try:
        data = request.get_json()
        base64_encoded_image = (data['file']['data'])
        base64_1 = (base64.b64decode(base64_encoded_image));
        s1=""
        text1=(imageToText.perform_ocr(base64_1))
        text1=imageToText.reduce(text1)

        template = data['file']['template']
        response = requests.get(template)
        template_bytes = None
        if response.status_code == 200:
            template_data = response.content
            base64_encoded_template = base64.b64encode(template_data).decode('utf-8')
            template_bytes = base64.b64decode(base64_encoded_template)
        text2=(imageToText.perform_ocr(template_bytes))
        text2=imageToText.reduce(text2)
        result = text_match.cosine_similarity_score(text1,text2);
        result1 = text_match.jaccard_similarity_score(text1,text2);
        print(text1,text2)
        return jsonify((result+result1)/2), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/api/upload', methods=['POST'])
def handle_upload():
    try:
        data = request.get_json()
        base64_encoded_image = data['file']['data']
        imgUrl = data['file']['imgUrl']
        image_bytes = base64.b64decode(base64_encoded_image)
        result_dict = similarImage.upload_pinecone_with_image_data(image_bytes,imgUrl)
        print(type(result_dict))
        print()
        return jsonify({'upserted_count': result_dict['upserted_count']}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400
    
if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(host='0.0.0.0', port=5000)