// Функция для подключения кошелька
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Запрос на подключение к MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const account = await signer.getAddress();
            console.log('Connected account:', account);

            document.getElementById('wallet-address').innerText = `Connected: ${account}`;
        } catch (err) {
            console.error('Error connecting to MetaMask:', err);
        }
    } else {
        alert('MetaMask is not installed');
    }
}

// Функция для отправки транзакции (Check In)
async function checkIn() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = '0x85c2658824ACE3c14FE2125f9D19e1Eee75DD2De'; // Укажи адрес твоего контракта
        const contractABI = [ // ABI функции checkIn
            "function checkIn() payable"
        ];

        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            // Отправляем транзакцию с минимальной суммой
            const tx = await contract.checkIn({
                value: ethers.utils.parseEther('0.0001') // сумма для транзакции
            });

            console.log('Transaction submitted:', tx);
        } catch (err) {
            console.error('Transaction failed:', err);
        }
    } else {
        alert('Please install MetaMask');
    }
}

// Привязываем кнопки к функциям
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('checkInButton').addEventListener('click', checkIn);
