import cv2
import numpy as np
import io
import matplotlib.pyplot as plt
import backgroundReplace


def process_images(image1_data, image2_data):
    image1_array = np.frombuffer(image1_data, np.uint8)
    image2_array = np.frombuffer(image2_data, np.uint8)

    image1 = cv2.imdecode(image1_array, cv2.IMREAD_COLOR)
    image2 = cv2.imdecode(image2_array, cv2.IMREAD_COLOR)

    if image1.shape != image2.shape:
        image2 = cv2.resize(image2, (image1.shape[1], image1.shape[0]))

    gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

    diff = cv2.absdiff(gray1, gray2)

    _, thresholded_diff = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

    contours, _ = cv2.findContours(thresholded_diff, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        cv2.rectangle(image1, (x, y), (x + w, y + h), (0,0,255), 2)# Red rectangles

    retval, buffer = cv2.imencode('.jpg', image1)
    result_image_data = buffer.tobytes()
    
    result_image = cv2.imdecode(np.frombuffer(result_image_data, np.uint8), cv2.IMREAD_COLOR)
    result_image_rgb = cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB)

    return result_image_rgb
