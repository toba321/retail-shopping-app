import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartItem, CartScreenNavigationProp } from '../types';
import { useCartStore } from '../store/useCart';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingIndicator } from '../components/common/LoadingIndicator';
import { ReservationTimer } from '../components/common/ReservationTimer';
import { CartItemRow } from '../components/cart/CartItemRow';
import { Button } from '../components/common/Button';
import { TotalContainer } from '../components/common/OrderTotal';
import { EmptyState } from '../components/common/EmptyState';

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
    const { items, total, expiresAt, isLoading, error, removeItem, setItemQuantity, fetchCart, setError } =
        useCartStore();

    const cartItems = Object.entries(items).map(([productId, item]) => ({
        productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
    }));

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        const item = items[productId];
        if (item) {
            setItemQuantity({ id: productId, name: item.name, price: item.price }, quantity);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            setError('Cart is empty. Please add items before checkout.');
            return;
        }
        navigation.navigate('Checkout', {});
    };

    return (
        <SafeAreaView style={styles.container}>

            <ReservationTimer expiresAt={expiresAt} />

            {error && (
                <ErrorMessage message={error} onDismiss={() => setError(null)} />
            )}

            <LoadingIndicator visible={isLoading} message="Updating cart..." />

            {cartItems.length === 0 ? (
                <EmptyState
                    title="Your cart is empty"
                    actionText="Continue Shopping"
                    onActionPress={() => navigation.navigate('ProductsList', {})}
                />
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.productId}
                        renderItem={({ item }) => (
                            <CartItemRow
                                item={item}
                                onRemove={removeItem}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                    />

                    <View style={styles.footer}>
                        <TotalContainer total={total} />

                        <Button
                            title="Proceed to Checkout"
                            onPress={handleCheckout}
                            variant="primary"
                            style={styles.checkoutButton}
                        />

                        <Button
                            title="Continue Shopping"
                            onPress={() => navigation.navigate('ProductsList', {})}
                            variant="secondary"
                            style={styles.continueShoppingButton}
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    checkoutButton: {
        marginBottom: 8,
    },
    continueShoppingButton: {
        marginBottom: 8,
    },
});
