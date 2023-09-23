from flask import Flask, jsonify, request , send_file
import os
import io
from PIL import Image
import imageToText
import templateMatching
import matplotlib as plt
import numpy as np
import cv2
import base64
import requests
import templateComparation
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
        print("ok")
        base64_encoded_image = data['file']['data']
        template = data['file']['template']
        image_bytes = base64.b64decode(base64_encoded_image)
        print(template)
        response = requests.get(template)
        print("ook")
        template_bytes = None
        if response.status_code == 200:
            template_data = response.content
            base64_encoded_template = base64.b64encode(template_data).decode('utf-8')
            template_bytes = base64.b64decode(base64_encoded_template)
        else:
            return jsonify({'error': str(e)}), 400
        result_dict = templateComparation.compare_images(image_bytes, template_bytes)
        # result_image_bgr = templateMatching.process_images(image_bytes,template_bytes)
        # result_image_rgb = cv2.cvtColor(result_image_bgr, cv2.COLOR_BGR2RGB)
        # _, buffer = cv2.imencode('.jpg', result_image_rgb)
        # result_image_data = buffer.tobytes()
        print(result_dict)
        return jsonify(result_dict), 200
        # return send_file(
        #     io.BytesIO(result_image_data),
        #     mimetype='image/jpeg',  
        #     as_attachment=True,
        #     download_name='result_image.jpg'  
        # )
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400




        
    
if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(host='0.0.0.0', port=5000)