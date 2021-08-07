#!/bin/bash

# STEP 1: Install CUDA
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-ubuntu2004.pin
sudo mv cuda-ubuntu2004.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/11.4.1/local_installers/cuda-repo-ubuntu2004-11-4-local_11.4.1-470.57.02-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2004-11-4-local_11.4.1-470.57.02-1_amd64.deb
sudo apt-key add /var/cuda-repo-ubuntu2004-11-4-local/7fa2af80.pub
sudo apt-get update
sudo apt-get -y install cuda
sudo apt-get install nvidia-gds
sudo rm -f cuda-repo-ubuntu2004-11-4-local_11.4.1-470.57.02-1_amd64.deb

echo "export PATH=/usr/local/cuda-11.4/bin${PATH:+:${PATH}}" >> ~/.bashrc
echo "export LD_LIBRARY_PATH=/usr/local/cuda-11.4/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}" >> ~/.bashrc
echo "export LD_LIBRARY_PATH=/usr/local/cuda-11.4/lib${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}" >> ~/.bashrc

# STEP 2: Install cuDNN
wget https://developer.nvidia.com/compute/machine-learning/cudnn/secure/8.2.2/11.4_07062021/Ubuntu20_04-x64/libcudnn8_8.2.2.26-1+cuda11.4_amd64.deb
sudo dpkg -i libcudnn8_8.2.2.26-1+cuda11.4_amd64.deb
sudo rm -f libcudnn8_8.2.2.26-1+cuda11.4_amd64.deb

# STEP 3: Install TensorRT
wget https://developer.nvidia.com/compute/machine-learning/tensorrt/secure/8.0.1/local_repos/nv-tensorrt-repo-ubuntu2004-cuda11.3-trt8.0.1.6-ga-20210626_1-1_amd64.deb
sudo dpkg -i nv-tensorrt-repo-ubuntu2004-cuda11.3-trt8.0.1.6-ga-20210626_1-1_amd64.deb
sudo apt-key add /var/nv-tensorrt-repo-ubuntu2004-cuda11.3-trt8.0.1.6-ga-20210626/7fa2af80.pub
sudo apt-get update
sudo apt-get install tensorrt
sudo apt-get install python3-libnvinfer-dev
sudo apt-get install uff-converter-tf
sudo apt-get install onnx-graphsurgeon
sudo rm -f nv-tensorrt-repo-ubuntu2004-cuda11.3-trt8.0.1.6-ga-20210626_1-1_amd64.deb
