// Placeholder images will be replaced with actual imports in the component
export const categories = [
    { id: 1, name: 'Burger', icon: 'cutlery' },
    { id: 2, name: 'Pizza', icon: 'pizza' },
    { id: 3, name: 'Pasta', icon: 'spoon' },
    { id: 4, name: 'Asian', icon: 'coffee' },
];

export const restaurants = [
    {
        id: 1,
        name: "Burger King's Court",
        rating: 4.8,
        time: "20-30 min",
        deliveryFee: "$2.99",
        image: "food_burger",
        category: "Burger",
        description: "The best gourmet burgers in town, flame-grilled to perfection with premium ingredients and artisanal buns.",
        menuItems: [
            {
                id: 101,
                name: "Classic Cheeseburger",
                description: "Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce",
                price: 8.99,
                image: "food_burger"
            },
            {
                id: 102,
                name: "Bacon Deluxe",
                description: "Double beef patty with crispy bacon, cheese, and BBQ sauce",
                price: 12.99,
                image: "food_burger"
            },
            {
                id: 103,
                name: "Truffle Fries",
                description: "Crispy golden fries with truffle oil and parmesan",
                price: 5.99,
                image: "food_burger"
            },
            {
                id: 104,
                name: "Veggie Burger",
                description: "Plant-based patty with avocado, sprouts, and chipotle mayo",
                price: 9.99,
                image: "food_burger"
            }
        ]
    },
    {
        id: 2,
        name: "Pasta Paradise",
        rating: 4.5,
        time: "30-45 min",
        deliveryFee: "$3.99",
        image: "food_pasta",
        category: "Pasta",
        description: "Authentic Italian pasta made fresh daily with imported ingredients and traditional recipes passed down through generations.",
        menuItems: [
            {
                id: 201,
                name: "Carbonara",
                description: "Creamy pasta with pancetta, egg, and parmesan",
                price: 14.99,
                image: "food_pasta"
            },
            {
                id: 202,
                name: "Truffle Mushroom Pasta",
                description: "Fettuccine with wild mushrooms and truffle cream sauce",
                price: 16.99,
                image: "food_pasta"
            },
            {
                id: 203,
                name: "Garlic Bread",
                description: "Toasted baguette with garlic butter and herbs",
                price: 4.99,
                image: "food_pasta"
            },
            {
                id: 204,
                name: "Penne Arrabbiata",
                description: "Spicy tomato sauce with garlic and red chili",
                price: 12.99,
                image: "food_pasta"
            }
        ]
    },
    {
        id: 3,
        name: "Pizza Inferno",
        rating: 4.9,
        time: "25-40 min",
        deliveryFee: "Free",
        image: "food_pizza",
        category: "Pizza",
        description: "Wood-fired pizzas with premium toppings, hand-tossed dough, and our signature tomato sauce made from San Marzano tomatoes.",
        menuItems: [
            {
                id: 301,
                name: "Margherita",
                description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
                price: 11.99,
                image: "food_pizza"
            },
            {
                id: 302,
                name: "Pepperoni Feast",
                description: "Loaded with premium pepperoni and extra cheese",
                price: 13.99,
                image: "food_pizza"
            },
            {
                id: 303,
                name: "Veggie Supreme",
                description: "Bell peppers, mushrooms, olives, onions, and tomatoes",
                price: 12.99,
                image: "food_pizza"
            },
            {
                id: 304,
                name: "BBQ Chicken",
                description: "Grilled chicken, BBQ sauce, red onions, and cilantro",
                price: 14.99,
                image: "food_pizza"
            }
        ]
    },
    {
        id: 4,
        name: "Wok & Roll",
        rating: 4.7,
        time: "25-35 min",
        deliveryFee: "$2.49",
        image: "food_burger", // Using burger as placeholder for Asian food
        category: "Asian",
        description: "Authentic Asian cuisine with bold flavors, fresh ingredients, and traditional cooking techniques from across the continent.",
        menuItems: [
            {
                id: 401,
                name: "Pad Thai",
                description: "Stir-fried rice noodles with shrimp, peanuts, and tamarind sauce",
                price: 13.99,
                image: "food_burger"
            },
            {
                id: 402,
                name: "Chicken Fried Rice",
                description: "Wok-tossed rice with chicken, vegetables, and soy sauce",
                price: 10.99,
                image: "food_burger"
            },
            {
                id: 403,
                name: "Spring Rolls",
                description: "Crispy vegetable spring rolls with sweet chili sauce",
                price: 6.99,
                image: "food_burger"
            },
            {
                id: 404,
                name: "Kung Pao Chicken",
                description: "Spicy stir-fry with peanuts, vegetables, and chili peppers",
                price: 14.99,
                image: "food_burger"
            }
        ]
    },
    {
        id: 5,
        name: "The Burger Lab",
        rating: 4.6,
        time: "20-30 min",
        deliveryFee: "$1.99",
        image: "food_burger",
        category: "Burger",
        description: "Experimental burger creations with unique flavor combinations and premium ingredients sourced locally.",
        menuItems: [
            {
                id: 501,
                name: "Mushroom Swiss Burger",
                description: "Sautéed mushrooms, Swiss cheese, and garlic aioli",
                price: 11.99,
                image: "food_burger"
            },
            {
                id: 502,
                name: "Spicy Jalapeño Burger",
                description: "Pepper jack cheese, jalapeños, and chipotle mayo",
                price: 10.99,
                image: "food_burger"
            },
            {
                id: 503,
                name: "Onion Rings",
                description: "Beer-battered crispy onion rings",
                price: 4.99,
                image: "food_burger"
            }
        ]
    },
    {
        id: 6,
        name: "Slice of Heaven",
        rating: 4.8,
        time: "30-40 min",
        deliveryFee: "Free",
        image: "food_pizza",
        category: "Pizza",
        description: "New York-style pizza with thin crust, generous toppings, and a perfect char from our brick oven.",
        menuItems: [
            {
                id: 601,
                name: "Meat Lovers",
                description: "Pepperoni, sausage, bacon, and ham",
                price: 15.99,
                image: "food_pizza"
            },
            {
                id: 602,
                name: "Hawaiian",
                description: "Ham, pineapple, and mozzarella",
                price: 12.99,
                image: "food_pizza"
            },
            {
                id: 603,
                name: "White Pizza",
                description: "Ricotta, mozzarella, garlic, and olive oil",
                price: 13.99,
                image: "food_pizza"
            }
        ]
    }
];
