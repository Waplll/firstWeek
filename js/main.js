let product = "Socks";



let app = new Vue({
    el: '#app',
    data: {
        product: "Носки",
        brand: 'Vue Mastery',
        description: "Пара теплых, пушистых носков.",
        selectedVariant: 0,
        altText: "Пара носков",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        inventory: 100,
        onSale: true,
        details: ['80% хлопок', '20% полиэстер', 'Гендерно-нейтральный'],
        variants: [
            {
                variantsId: 2234,
                variantColor: 'green',
                variantImage: "./img/Green-Socks.jpg",
                variantQuantity: 10
            },
            {
                variantsId: 2235,
                variantColor: 'blue',
                variantImage: "./img/Blue-Socks.jpg",
                variantQuantity: 0
            }
        ],
        sizes: ['S','M','L','XL','XXL','XXXL'],
        cart: 0,
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        deleteFromCart() {
            this.cart -= 1
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            if (this.onSale) {
                return "Распродажа!" + " " + this.brand + " " + this.product + " " + "по специальной цене!";
            } else {
                return "Распродажы нет." + " " + this.brand + " " + this.product + " " + "по стандартной цене.";
            }
        }
    }
})
