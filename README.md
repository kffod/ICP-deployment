# FitnFrame - Decentralized Fitness Application

A blockchain-powered fitness application built on the Internet Computer (ICP) that combines AI-powered pose detection with decentralized data ownership.

## 🏋️ Overview

FitnFrame is a full-stack decentralized application (dApp) that allows users to track their fitness activities using real-time pose detection while maintaining complete control over their data through blockchain technology.

## ✨ Features

- **AI-Powered Pose Detection**: Real-time workout tracking using TensorFlow.js
- **Blockchain Authentication**: Secure login with Internet Identity, NFID, and Plug
- **Decentralized Data Storage**: User data stored on the Internet Computer blockchain
- **Real-time Workout Tracking**: Monitor exercises, calories, and progress
- **Achievement System**: Gamified fitness challenges and rewards
- **Cross-platform**: Works on web browsers with camera access

## 🛠️ Tech Stack

### Backend
- **Motoko**: Smart contract language for Internet Computer
- **Internet Computer**: Blockchain platform for decentralized applications
- **Candid**: Interface definition language for canister interactions

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **TensorFlow.js**: AI/ML library for pose detection
- **Framer Motion**: Animation library

### Authentication
- **Internet Identity**: Decentralized identity solution
- **NFID**: Web3 identity provider
- **Plug Wallet**: Browser extension wallet

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- DFX (Internet Computer SDK)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ManishRai005/FitnFrame.git
   cd FitnFrame
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd src/FitnFrame_frontend
   npm install
   ```

3. **Start local development**
   ```bash
   # Start local Internet Computer replica
   dfx start --background
   
   # Deploy canisters locally
   dfx deploy
   
   # Start frontend development server
   cd src/FitnFrame_frontend
   npm run start
   ```

### Deployment to Mainnet

1. **Deploy to Internet Computer mainnet**
   ```bash
   dfx deploy --ic
   ```

2. **Access the application**
   - Frontend: `https://[CANISTER_ID].ic0.app`
   - Backend: `https://[CANISTER_ID].ic0.app`

## 📁 Project Structure

```
FitnFrame/
├── src/
│   ├── FitnFrame_backend/          # Motoko smart contracts
│   │   └── main.mo                 # Main canister logic
│   ├── FitnFrame_frontend/         # React frontend
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   ├── StateManagement/    # Context and state management
│   │   │   └── main.jsx           # App entry point
│   │   └── package.json
│   └── declarations/               # Auto-generated TypeScript interfaces
├── dfx.json                        # DFX configuration
└── package.json                    # Root package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
DFX_NETWORK=ic
CANISTER_ID_FITNFRAME_BACKEND=your_backend_canister_id
CANISTER_ID_FITNFRAME_FRONTEND=your_frontend_canister_id
CANISTER_ID_INTERNET_IDENTITY=rdmx6-jaaaa-aaaaa-aaadq-cai
```

## 🎯 Key Features Implementation

### Pose Detection
- Uses TensorFlow.js and MediaPipe for real-time pose estimation
- Tracks 33 body landmarks for accurate exercise monitoring
- Supports multiple exercise types and form validation

### Blockchain Integration
- Motoko canisters handle user data and fitness tracking
- Internet Identity for secure, decentralized authentication
- On-chain storage for workout history and achievements

### Authentication Flow
1. User connects with Internet Identity, NFID, or Plug
2. Identity delegation is created for canister access
3. User data is associated with their principal ID
4. Secure, privacy-preserving data ownership

## 🚧 Development Challenges & Solutions

### Cross-Platform Development
- **Challenge**: WSL/Windows environment conflicts
- **Solution**: Proper dependency management and build configuration

### AI Integration
- **Challenge**: Large ML models in browser environment
- **Solution**: Optimized TensorFlow.js models and lazy loading

### Blockchain Authentication
- **Challenge**: Multiple identity providers integration
- **Solution**: Unified authentication layer with IdentityKit

## 📊 Performance Optimizations

- Lazy loading of TensorFlow.js models
- Optimized canister calls with batching
- Efficient pose detection with frame rate limiting
- Responsive UI with Tailwind CSS

## 🔒 Security Features

- Decentralized identity management
- On-chain data ownership
- Secure delegation patterns
- Privacy-preserving data storage

## 🧪 Testing

```bash
# Run frontend tests
cd src/FitnFrame_frontend
npm run test

# Run backend tests
dfx canister call FitnFrame_backend test
```

## 📈 Future Enhancements

- [ ] Mobile app development
- [ ] Social features and challenges
- [ ] Integration with fitness wearables
- [ ] Advanced analytics dashboard
- [ ] Cross-chain interoperability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Blockseblock** for the internship opportunity
- Internet Computer Foundation for the blockchain platform
- TensorFlow.js team for the pose detection models
- React and Vite communities for excellent tooling

## 📞 Contact

- **Developer**: Sachin Jadhav
- **LinkedIn**: www.linkedin.com/in/sachin-jadhav-a3667b248

---

**Built with ❤️ during the Blockseblock Blockchain Internship Program**
