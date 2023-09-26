import cv2
import numpy as np
from skimage.metrics import structural_similarity as compare_ssim
from PIL import Image
import imagehash

def calculate_color_similarity(image1, image2):
    # Calculate color histograms for the images
    hist1 = cv2.calcHist([image1], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    hist2 = cv2.calcHist([image2], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])

    # Normalize histograms
    hist1 /= hist1.sum()
    hist2 /= hist2.sum()

    # Calculate the Bhattacharyya coefficient
    bhattacharyya_coefficient = cv2.compareHist(hist1, hist2, cv2.HISTCMP_BHATTACHARYYA)

    # Calculate color similarity as a percentage (higher value means more similar)
    color_similarity = (1 - bhattacharyya_coefficient) * 100

    return color_similarity

def compare_images(binary_data1, binary_data2):
    nparr1 = np.frombuffer(binary_data1, np.uint8)
    nparr2 = np.frombuffer(binary_data2, np.uint8)

    image1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
    image2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)

    main_gray = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    template_gray = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

    sift = cv2.SIFT_create()
    image1 = cv2.resize(image1, (image2.shape[1], image2.shape[0]))
    keypoints_template, descriptors_template = sift.detectAndCompute(template_gray, None)
    keypoints_image, descriptors_image = sift.detectAndCompute(main_gray, None)

    bf = cv2.BFMatcher()

    matches = bf.knnMatch(descriptors_template, descriptors_image, k=2)

    matching_results = []

    for m, n in matches:
        if m.distance < 0.75 * n.distance:
            matching_results.append(m)

    match_ratio = (len(matching_results) / len(keypoints_template)) * 100

    image1_pil = Image.fromarray(cv2.cvtColor(image1, cv2.COLOR_BGR2RGB))
    image2_pil = Image.fromarray(cv2.cvtColor(image2, cv2.COLOR_BGR2RGB))

    hash1 = imagehash.phash(image1_pil)
    hash2 = imagehash.phash(image2_pil)

    hamming_distance = hash1 - hash2

    ssim_score = compare_ssim(cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY), template_gray)

    # Print the results
    if hamming_distance > 100:
        hamming_persentage = 0
    else:
        hamming_persentage = (1 - (hamming_distance) / 100) * 100
    result_dict = {
        "SSIM": ssim_score * 100,
        "SIFT": match_ratio,
        "Hash": hamming_persentage,
    }
    color_similarity = calculate_color_similarity(image1, image2)

    # Add color similarity to the result dictionary
    result_dict["Color"] = color_similarity

    return result_dict