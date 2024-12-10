import { View, Text } from 'react-native';
import { IconMapPin, IconQrcode, IconTicket } from '@tabler/icons-react-native';

import { Step } from '@/components/step';
import { s } from './styles';

const steps = [
    {
        title: "Encontre estabelecimentos",
        description: "Veja locais perto de você que são parceiros Nearby",
        icon: IconMapPin
    },
    {
        title: "Ative o cupom com QR Code",
        description: "Escaneie o código no estabelecimento para usar o benefício",
        icon: IconQrcode
    },
    {
        title: "Garanta vantagens perto de você",
        description: "Ative cupons onde estiver, em diferentes tipos de estabelecimento",
        icon: IconTicket
    }
]

export function Steps() {
    return (
        <View style={s.container}>
            <Text style={s.title}>
                Veja como funciona:
            </Text>

            {steps.map((step, index) => (
                <Step
                    key={index}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                />
            ))}
        </View>
    );
};