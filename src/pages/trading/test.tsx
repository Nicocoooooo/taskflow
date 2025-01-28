// src/pages/trading/test.tsx
import { useTrades } from '../../features/trading/hooks';

const TestTradingPage = () => {
    const { trades, isLoading, error, addTrade } = useTrades();

    // Ajoutons un bouton pour tester l'ajout d'un trade
    const handleAddTest = async () => {
        try {
            await addTrade({
                name: "Test Trade",
                pair: "EUR/USD",
                direction: "LONG",
                entry_price: 1.0950,
                stop_loss: 1.0900,
                take_profit: 1.1000,
                position_size: 1.0,
                entry_date: new Date(),
                status: "open",
                pre_analysis: "Test analysis"
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout du trade:", error);
        }
    };

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error.message}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Test Trading</h1>

            <button
                onClick={handleAddTest}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Ajouter un Trade Test
            </button>

            <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(trades, null, 2)}
            </pre>
        </div>
    );
};

export default TestTradingPage;