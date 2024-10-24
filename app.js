let provider;
let web3Modal;

// Инициализация Web3Modal
async function init() {
    try {
        // Инициализация Web3Modal
        web3Modal = new Web3Modal({
            cacheProvider: false, // Не кэшировать провайдер
            providerOptions: {} // Здесь можно добавить опции для дополнительных провайдеров
        });
        console.log("Web3Modal initialized");
    } catch (error) {
        console.error("Error initializing Web3Modal:", error);
    }
}

// Функция подключения к кошельку
async function connectWallet() {
    try {
        if (!web3Modal) {
            console.error('Web3Modal not initialized');
            return;
        }

        // Подключение к кошельку
        provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();

        const account = await signer.getAddress();
        console.log('Connected account:', account);

        document.getElementById('wallet-address').innerText = `Connected: ${account}`;

        // Добавляем обработчик события для отключения кошелька
        provider.on("disconnect", (error) => {
            console.log("Wallet disconnected", error);
            provider = null; // Сбросить провайдер
            document.getElementById('wallet-address').innerText = "Not connected";
        });

        // Проверяем, если кошелек уже подключен
        await checkIfWalletIsConnected();

    } catch (err) {
        console.error('Error connecting to wallet:', err);
    }
}

// Проверяем, подключен ли кошелек
async function checkIfWalletIsConnected() {
    try {
        if (provider) {
            const accounts = await provider.listAccounts();

            if (accounts.length) {
                const account = accounts[0];
                console.log('Found an account:', account);
                document.getElementById('wallet-address').innerText = `Connected: ${account}`;
            } else {
                console.log('No accounts found');
            }
        }
    } catch (err) {
        console.error('Error checking accounts:', err);
    }
}

// Функция для выполнения Check In
async function checkIn() {
    if (provider) {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();

        const contractAddress = '0x85c2658824ACE3c14FE2125f9D19e1Eee75DD2De'; // Укажи адрес твоего контракта
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
        alert('Please connect your wallet first');
    }
}

// Привязываем кнопки к функциям
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('checkInButton').addEventListener('click', checkIn);

// Инициализация при загрузке страницы
window.addEventListener('load', async () => {
    await init(); // Инициализируем Web3Modal
    await checkIfWalletIsConnected(); // Проверяем, подключен ли кошелек
});
