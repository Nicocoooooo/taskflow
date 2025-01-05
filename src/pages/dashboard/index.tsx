import React from 'react';
import { Button } from '../../components/common/Button';

const DashboardPage = () => {
    return (
        <div className="w-full max-w-[100vw] p-4 md:p-8">
            <h1 className="text-2xl font-semibold mb-6">Test des Composants</h1>

            <div className="space-y-8 max-w-full">
                <div>
                    <h2 className="text-xl mb-4">Variants de Boutons</h2>
                    <div className="flex flex-wrap gap-4">
                        <Button>Bouton Primary</Button>
                        <Button variant="secondary">Bouton Secondary</Button>
                        <Button variant="danger">Bouton Danger</Button>
                        <Button variant="ghost">Bouton Ghost</Button>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl mb-4">Tailles de Boutons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl mb-4">États de Boutons</h2>
                    <div className="flex flex-wrap gap-4">
                        <Button disabled>Désactivé</Button>
                        <Button isLoading>Chargement</Button>
                    </div>
                </div>

                <div className="max-w-sm">
                    <h2 className="text-xl mb-4">Bouton Pleine Largeur</h2>
                    <Button fullWidth>Pleine Largeur</Button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;