let provider;
let web3Modal;

async function init() {
    // Инициализация Web3Modal
    web3Modal = new Web3Modal({
        cacheProvider: false, // Не кэшировать провайдер
        providerOptions: {} // Здесь можно добавить опции для дополнительных провайдеров
    });
}

async function connectWallet() {
    try {
        // Подключение к кошельку
        provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();

        const account = await signer.getAddress();
        console.log('Connected account:', account);

        document.getElementById('wallet-address').innerText = `Connected: ${account}`;
    } catch (err) {
        console.error('Error connecting to wallet:', err);
    }
}

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
init();
