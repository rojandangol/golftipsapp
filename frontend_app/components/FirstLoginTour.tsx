import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';

interface TourStep {
    id: string;
    title: string;
    description: string;
    position: 'top' | 'bottom';
}

interface FirstLoginTourProps {
    visible: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

const TOUR_STEPS: TourStep[] = [

    {
        id: 'welcome',
        title: 'Welcome to GolfTips for the Weekend Warriors!',
        description:
           "We're excited to have you on board. This quick tour will guide you through the main features of the app. If you wish to skip it, tap the skip button below.",
        position: 'bottom',
    },
    {
        id: 'search',
        title: 'Search Tips',
        description:
            'Use the search bar to find tips by title or category. Search for the tip you want that matches your needs.',
        position: 'bottom',
    },
    {
        id: 'home',
        title: 'Home',
        description:
            "Your home page shows your tip of the day and saved tips. Check back daily for new tips to practice. If you scroll down, you'll be able to see all the tips that you saved. ",
        position: 'top',
    },
    {
        id: 'explore',
        title: 'Explore',
        description:
            'Browse all available tips organized by category. Discover new techniques and tips to enhance your golf skills to one up your buddy.',
        position: 'top',
    },
    {
        id: 'about',
        title: 'About',
        description:
            'Learn more about this app and the reason for its existence.',
        position: 'top',
    },
    {
        id: 'menu',
        title: 'Menu',
        description:
            "You can edit your profile and read our Privacy Policy.",
        position: 'bottom',
    },
];

const { width, height } = Dimensions.get('window');

const FirstLoginTour: React.FC<FirstLoginTourProps> = ({
    visible,
    onComplete,
    onSkip,
}) => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const step = TOUR_STEPS[currentStep];

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
            setCurrentStep(0);
        }
    };

    const handleSkip = () => {
        onSkip();
        setCurrentStep(0);
    };

    // if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleSkip}
        >
            <View style={styles.overlay}>
                {/* Highlight Box - position changes based on step */}
                <View
                    style={[
                        styles.highlightBox,
                        step.id === 'welcome' && {
                        },
                        step.id === 'search' && {
                            top: height * 0.12,
                            left: 20,
                            right: 20,
                            height: 50,
                        },
                        step.id === 'home' && {
                            bottom: height * 0.01,
                            left: width * 0.05,
                            width: width * 0.25,
                            height: 70,
                        },
                        step.id === 'explore' && {
                            bottom: height * 0.01,
                            left: width * 0.5,
                            marginLeft: -width * 0.15,
                            width: width * 0.30,
                            height: 70,
                        },
                        step.id === 'about' && {
                            bottom: height * 0.01,
                            right: width * 0.04,
                            width: width * 0.26,
                            height: 70,
                        },
                        step.id === 'menu' && {
                            top: height * 0.054,
                            left: 10,
                            width: 50,
                            height: 50,
                        },
                    ]}
                />

                {/* Tooltip */}
                <View
                    style={[
                        styles.tooltip,
                        step.position === 'top' ? styles.tooltipTop : styles.tooltipBottom,
                    ]}
                >
                    <Text style={styles.tooltipTitle}>{step.title}</Text>
                    <Text style={styles.tooltipDescription}>{step.description}</Text>

                    {/* Step indicator */}
                    <View style={styles.stepIndicator}>
                        {TOUR_STEPS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentStep ? styles.dotActive : styles.dotInactive,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={handleSkip}
                        >
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleNext}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentStep === TOUR_STEPS.length - 1 ? 'Done' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    highlightBox: {
        position: 'absolute',
        borderWidth: 3.5,
        borderColor: '#FCD34D',
        borderRadius: 16,
        backgroundColor: 'rgba(0, 105, 91, 0.1)',
    },
    tooltip: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    tooltipTop: {
        marginTop: 20,
    },
    tooltipBottom: {
        marginBottom: 20,
    },
    tooltipTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00695B',
        marginBottom: 8,
    },
    tooltipDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: '#00695B',
    },
    dotInactive: {
        backgroundColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skipButton: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00695B',
        alignItems: 'center',
    },
    skipButtonText: {
        color: '#00695B',
        fontSize: 14,
        fontWeight: '600',
    },
    nextButton: {
        flex: 1,
        marginLeft: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#00695B',
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default FirstLoginTour;