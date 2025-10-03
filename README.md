# Quantum Signers

This project is a monorepo containing two sub-projects: a backend service for quantum-safe cryptographic signatures and a mobile application.

## About the Project

The Quantum Signers project is a quantum-safe cryptographic signature implementation. It utilizes post-quantum cryptography algorithms to sign and verify digital images, ensuring their authenticity and integrity in a post-quantum computing world.

The project consists of two main components:

*   A **backend service** built with Python and FastAPI, which exposes an API for signing and verifying images using the Dilithium2 algorithm from the Open Quantum Safe (OQS) library.
*   A **mobile application** built with React Native (Expo) that allows users to interact with the backend service to sign and verify images.

## Sub-projects

*   **[Backend](./backend/README.md)**: A Python-based backend service that uses post-quantum cryptography to sign and verify digital images.
*   **[Frontend](./frontend/README.md)**: An Expo-based mobile application that interacts with the backend.

## Tech arsenal
```mermaid
graph TD;
A["Signed with Quantum"] --> B["App development"]
A --> C["AI/ML Engineering"]
A --> D["Quantum Encryption"]

B --> B1["React Native(Expo)"]
B --> B2["FastAPI Backend"]

C --> C1["Vision-Language Model"]
C --> C2["BLIP"]

D --> D1["liboqs-python"]
D --> D2["Open Quantum Safe (OQS)"]
```

## Global Setup

To set up and run this project, you will need to follow the setup instructions for each sub-project individually.

### 1. Backend Setup

Navigate to the `backend` directory and follow the instructions in its [README.md](./backend/README.md).

```bash
cd backend
# Follow the setup instructions in backend/README.md
```

### 2. Frontend Setup

Navigate to the `frontend` directory and follow the instructions in its [README.md](./frontend/README.md).

```bash
cd ../frontend
# Follow the setup instructions in frontend/README.md
```

Once both the backend and the mobile app are set up and running, they will be able to communicate with each other.
