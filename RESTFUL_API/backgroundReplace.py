from PIL import Image
import numpy as np
import cv2

def getBackgroundColor(x,y,image1):
    # Ensure that the (x, y) coordinates are within the bounds of the image
    x = x-1
    if 0 <= x < image1.shape[1] and 0 <= y < image1.shape[0]:
        pixel_color = image1[y, x]
        blue, green, red = pixel_color
        print(blue,green,red)
        return (int(red),int(green),int(blue))
    return (0,0,0)

