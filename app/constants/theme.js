export const theme = {
    colors: {
        primary: '#f49b33',
        primaryDark: '#d97f1f',
        primaryLight: '#ffb866',
        background: '#1a1a1a',
        surface: '#2b2b2b',
        surfaceElevated: '#3b3b3b',
        surfaceHigh: '#4b5563',
        textPrimary: '#ffffff',
        textSecondary: '#d1d5db',
        textMuted: '#9ca3af',
        textDim: '#6b7280',
        border: '#3b3b3b',
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
        info: '#3b82f6',
        overlay: 'rgba(0,0,0,0.55)',
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        pill: 999,
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
    },
    shadows: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 5,
        },
        glow: {
            shadowColor: '#f49b33',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 8,
        },
    },
    gradients: {
        primary: ['#f49b33', '#ff7e3d'],
        surface: ['#2b2b2b', '#1a1a1a'],
        heroDark: ['transparent', 'rgba(0,0,0,0.85)'],
    },
};

export const ORDER_STATUSES = ['placed', 'preparing', 'on_the_way', 'delivered'];

export const ORDER_STATUS_LABELS = {
    placed: 'Order Placed',
    preparing: 'Preparing',
    on_the_way: 'On the way',
    delivered: 'Delivered',
};
