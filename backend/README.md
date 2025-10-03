# Prism-hack

A quantum-safe cryptographic signature implementation for the Samsung Gen AI Hack, utilizing post-quantum cryptography algorithms to sign and verify digital images.

##  Index
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

##  Overview Of the project 

This project implements quantum-resistant digital signatures using the Dilithium2 algorithm from the Open Quantum Safe (OQS) library. It provides functionality to sign images and verify their authenticity, protecting against tampering even in a post-quantum computing era.

##  Features of this Project 

- **Quantum-Safe Signatures**: Uses Dilithium2 algorithm for post-quantum security
- **Image Signing**: Sign JPEG images with quantum-resistant signatures
- **Signature Verification**: Verify image authenticity and detect tampering
- **Cross-Platform**: Works on Windows, Linux, and macOS
- **Modern Python**: Built with Python 3.13 and managed with uv

##  Prerequisites

### System Requirements
- Python 3.13 or higher
- Git (for cloning dependencies)
- C compiler (for building liboqs-python):
  - **Linux**: gcc or clang
  - **Windows**: Visual Studio Build Tools or MinGW
  - **macOS**: Xcode Command Line Tools

## Setup

To run this project, you will need to have the `liboqs` library compiled and installed on your system. You can find instructions on how to do this in the [official `liboqs` GitHub repository](https://github.com/open-quantum-safe/liboqs).

Please be aware that you might encounter some issues while compiling the library.

You will also need to install the Python dependencies:

```bash
pip install -r requirements.txt
```

### Installing uv

uv is a fast Python package installer and resolver. Install it using one of the following methods:

#### On Linux/macOS:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### On Windows (PowerShell):
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### Alternative installation via pip:
```bash
pip install uv
```

#### Via Homebrew (macOS/Linux):
```bash
brew install uv
```

After installation, verify uv is installed:
```bash
uv --version
```

##  Installation

### 1. Clone the Repository

```bash
git clone https://github.com/raptor7197/signed-with-quantum.git
cd signed-with-quantum
```

### 2. Install Python 3.13

The project requires Python 3.13. uv will automatically handle the Python version if you have it installed. Otherwise:

#### Using uv to install Python:
```bash
uv python install 3.13
```

#### Manual installation:
- **Linux**: Use your package manager or pyenv
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **macOS**: Use Homebrew (`brew install python@3.13`) or download from python.org

### 3. Create Virtual Environment and Install Dependencies

uv will automatically create a virtual environment and install all dependencies:

```bash
# This single command creates .venv and installs all dependencies
uv sync
```

This command will:
- Create a `.venv` directory with a Python 3.13 virtual environment
- Install all dependencies from `pyproject.toml`
- Clone and build `liboqs-python` from GitHub
- Generate/update the `uv.lock` file

### 4. Activate the Virtual Environment (Optional)

While uv can run commands directly in the virtual environment, you can also activate it manually:

#### On Linux/macOS:
```bash
source .venv/bin/activate
```

#### On Windows (Command Prompt):
```cmd
.venv\Scripts\activate.bat
```

#### On Windows (PowerShell):
```powershell
.venv\Scripts\Activate.ps1
```

##  Project Folder Structure

```
Prism-hack/
├── .venv/                  # Virtual environment (auto-created)
├── images/                 # Sample images for testing
│   ├── test_image_2.jpeg
│   └── test_image_for_wtv.jpeg
├── .gitignore             # Git ignore rules
├── .python-version        # Python version specification (3.13)
├── pyproject.toml         # Project configuration and dependencies
├── uv.lock                # Locked dependency versions
├── idk.py                 # Image signing implementation
├── test_implementation.py # Basic signature testing
└── README.md              # This file
```

##  Usage

### Running Scripts with uv

You can run Python scripts directly with uv without activating the virtual environment:

```bash
# Run the image signing example
uv run python main.py

# Run the test implementation
uv run python test_implementation.py

# Run the test implementation with Image
uv run python test_implementation_with_image.py

```

### Running Scripts with Activated Environment

If you've activated the virtual environment:

```bash
# Run the image signing example
python main.py

# Run the test implementation
python test_implementation.py
```

### Example: Sign and Verify an Image

```python
from PIL import Image
import io
import oqs

# Load an image
img = Image.open("images/test_image_2.jpeg")
buffer = io.BytesIO()
img.save(buffer, format="JPEG")
image_bytes = buffer.getvalue()

# Create signature
with oqs.Signature("Dilithium2") as signer:
    public_key = signer.generate_keypair()
    signature = signer.sign(image_bytes)
    
    # Verify signature
    valid = signer.verify(image_bytes, signature, public_key)
    print("Signature valid?", valid)
```

##  Development

### Adding Dependencies

To add new dependencies to the project:

```bash
# Add a production dependency
uv add package-name

# Add a development dependency
uv add --dev package-name

# Add a specific version
uv add "package-name>=1.0.0"
```

### Updating Dependencies

```bash
# Update all dependencies to their latest compatible versions
uv sync --upgrade

# Update a specific package
uv add --upgrade package-name
```

### Running Tests

```bash
# Run tests with uv
uv run python -m pytest

# Or with activated environment
python -m pytest
```

##  Troubleshooting

### Common Issues

#### 1. liboqs-python Build Fails

If the liboqs-python build fails, ensure you have the required build tools:
This Library has to be compiled from scratch from the Github repo so...
This has been Included in the Dockerfile.
 ```bash
cd ..
git clone https://github.com/open-quantum-safe/oqs-python.git
cd oqs-python
pip install .

 ```


**Linux:**
```bash
sudo apt-get install build-essential cmake  # Debian/Ubuntu
sudo dnf install gcc cmake make             # Fedora
sudo pacman -S base-devel cmake             # Arch
```

**Windows:**
Install Visual Studio Build Tools or MinGW-w64

**macOS:**
```bash
xcode-select --install
```

#### 2. Python 3.13 Not Found

If uv can't find Python 3.13:
```bash
# Install Python 3.13 with uv
uv python install 3.13

# Or specify the Python path explicitly
uv venv --python /path/to/python3.13
```

#### 3. Permission Errors on Windows

Run PowerShell as Administrator or adjust execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 4. Virtual Environment Not Activating

Ensure the virtual environment exists:
```bash
# Recreate the virtual environment
uv venv --python 3.13

# Then sync dependencies
uv sync
```

### Cleaning and Reinstalling

If you encounter persistent issues:

```bash
# Remove virtual environment and lock file
rm -rf .venv uv.lock  # Linux/macOS
rmdir /s .venv && del uv.lock  # Windows CMD

# Reinstall everything
uv sync
```

## 📄 Dependencies
The project uses the following main dependencies:

- **liboqs-python**: Post-quantum cryptography library (installed from GitHub, not PyPI)
- **oqs** (>=0.10.2): Open Quantum Safe Python bindings for post-quantum algorithms
- **Pillow** (>=11.3.0): Python Imaging Library for image processing

Other dependencies may be specified in `pyproject.toml` as needed for development or testing. 













## Running the Application

To run the application, you can use the following command:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Connecting to the Frontend

After building the application, you will need to link the backend to the frontend by providing the backend URL to the frontend application.

## Deployment

A Dockerfile is provided for containerizing the application. However, there might be some issues with the library compilation and the Dockerfile when deploying the application.


