// Функция для подключения к кошельку
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Запрос на подключение к кошельку
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log('Connected account:', account);
            document.getElementById('wallet-address').innerText = `Connected: ${account}`;
        } catch (err) {
            console.error('Error connecting to wallet:', err);
        }
    } else {
        alert('Please install a cryptocurrency wallet like MetaMask.');
    }
}

// Функция для выполнения Check In
async function checkIn() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = '0x85c2658824ACE3c14FE2125f9D19e1Eee75DD2De'; // Укажите адрес вашего контракта
        const contractABI = [
            "function checkIn() payable"
        ];

        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.checkIn({
                value: ethers.utils.parseEther('0.0001') // сумма для транзакции
            });

            console.log('Transaction submitted:', tx);
        } catch (err) {
            console.error('Transaction failed:', err);
        }
    } else {
        alert('Please connect your wallet first.');
    }
}

// Привязываем кнопки к функциям
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('checkInButton').addEventListener('click', checkIn);
