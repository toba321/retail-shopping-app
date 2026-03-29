import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { CheckoutResponse, CartItem, CheckoutScreenNavigationProp } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingIndicator } from '../components/common/LoadingIndicator';
import { ReservationTimer } from '../components/common/ReservationTimer';
import { DiscountInput } from '../components/checkout/DiscountInput';
import { OrderReview } from '../components/checkout/OrderReview';
import { Button } from '../components/common/Button';

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
    const { items, total, expiresAt } = useCartStore();
    const cartItems = Object.entries(items).map(([productId, item]) => ({
        productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
    }));
    const {
        checkoutResponse,
        isLoading,
        error,
        handleCheckout,
        resetCheckout,
        setError,
        discountCode,
        discountCodeError,
        selectedDiscountDescription,
        handleDiscountCodeChange,
    } = useCheckout();

    if (checkoutResponse && checkoutResponse.status === 'SUCCESS') {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.successContent}>
                    <View style={styles.successIcon}>
                        <Text style={styles.successIconText}>✓</Text>
                    </View>

                    <Text style={styles.successTitle}>Order Confirmed!</Text>
                    <Text style={styles.successMessage}>
                        Thank you for your purchase
                    </Text>

                    <View style={styles.orderSummary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Order ID:</Text>
                            <Text style={styles.summaryValue}>{checkoutResponse.orderId}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal:</Text>
                            <Text style={styles.summaryValue}>
                                £{checkoutResponse.subtotal.toFixed(2)}
                            </Text>
                        </View>

                        {checkoutResponse.discountApplied > 0 && (
                            <View style={[styles.summaryRow, styles.discountRow]}>
                                <Text style={styles.summaryLabel}>Discount:</Text>
                                <Text style={[styles.summaryValue, styles.discountValue]}>
                                    -£{checkoutResponse.discountApplied.toFixed(2)}
                                </Text>
                            </View>
                        )}

                        {checkoutResponse.discountApplied > 0 && checkoutResponse.appliedDiscountDescription && (
                            <View style={[styles.summaryRow, styles.discountRow]}>
                                <Text style={styles.summaryLabel}>Offer:</Text>
                                <Text style={[styles.summaryValue, styles.discountValue]}>
                                    {checkoutResponse.appliedDiscountCode} - {checkoutResponse.appliedDiscountDescription}
                                </Text>
                            </View>
                        )}

                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalValue}>
                                £{checkoutResponse.total.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.itemsList}>
                        <Text style={styles.itemsListTitle}>Items:</Text>
                        {checkoutResponse.items.map((item: CartItem) => (
                            <View key={item.productId} style={styles.itemRow}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemDetail}>
                                    {item.quantity} × £{item.price.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Button
                        title="Continue Shopping"
                        onPress={() => {
                            resetCheckout();
                            navigation.navigate('ProductsList', {});
                        }}
                        variant="secondary"
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <ReservationTimer expiresAt={expiresAt} />

            {error && (
                <ErrorMessage message={error} onDismiss={() => setError(null)} />
            )}

            <LoadingIndicator visible={isLoading} message="Processing checkout..." />

            <ScrollView contentContainerStyle={styles.content}>
                <DiscountInput
                    discountCode={discountCode}
                    onDiscountCodeChange={handleDiscountCodeChange}
                    error={discountCodeError}
                />

                {selectedDiscountDescription && (
                    <View style={styles.detectedOfferContainer}>
                        <Text style={styles.detectedOfferLabel}>Selected offer for confirmation:</Text>
                        <Text style={styles.detectedOfferValue}>{discountCode} - {selectedDiscountDescription}</Text>
                    </View>
                )}

                <OrderReview items={cartItems} total={total} discountCode={discountCode || undefined} />

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        By completing this purchase, you agree to our terms and conditions.
                    </Text>
                </View>

                <Button
                    title="Complete Purchase"
                    onPress={handleCheckout}
                    variant="primary"
                    loading={isLoading}
                    disabled={isLoading}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    disclaimer: {
        backgroundColor: '#fafafa',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    disclaimerText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    detectedOfferContainer: {
        backgroundColor: '#f0f8ff',
        borderWidth: 1,
        borderColor: '#d6eaff',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    detectedOfferLabel: {
        fontSize: 12,
        color: '#4a6b8a',
        marginBottom: 2,
    },
    detectedOfferValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    successContent: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        flexGrow: 1,
        justifyContent: 'center',
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        alignSelf: 'center',
    },
    successIconText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    orderSummary: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    discountRow: {
        borderBottomColor: '#e0e0e0',
    },
    totalRow: {
        borderBottomWidth: 0,
        paddingTop: 12,
        paddingBottom: 0,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    discountValue: {
        color: '#34C759',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    itemsList: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    itemsListTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    itemRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    itemDetail: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});
