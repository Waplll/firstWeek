Vue.component('product', {
    template: `
    <div class="product">
        <div class="product-image">
            <img :alt="altText" :src="image"/>
        </div>
        <div class="product-info">
            <div class="product-title">
                <h1>{{ title }}</h1>
                <p class="infoSale">{{ sale }}</p>
            </div>
            <div class="rendering">
                <p v-if="inStock">Товар есть на складе</p>
                <p v-else :class="{ OutOfStock:!inStock }">Нет в наличии</p>
            </div>
            <div class="description">
                <h2>Описание:</h2>
                <p>{{ description }}</p>
            </div>
            <div class="detail">
                <h2>Характеристики:</h2>
                <product-details :details="filterDetails"></product-details>
            </div>
            <p>Доставка: {{ shipping }}</p>
            <div
                class="color-box"
                v-for="(variant, index) in variants" 
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
            >
             </div>
            <div class="product-sizes">
                <div class="size" v-for="size in sizes">{{ size }}</div>
            </div>
            <button 
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}"
            >Добавить в корзину</button>
            <button v-on:click="deleteFromCart">Удалить из карзины</button>
            <div class="moreProducts">
                <a :href="link">Больше подобных товаров</a>
            </div>
        </div>
    </div>
    `,
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            product: "Носки",
            brand: 'Vue Mastery',
            description: "Пара теплых, пушистых носков.",
            selectedVariant: 0,
            altText: "Пара носков",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: true,
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
            cart: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantsId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        deleteFromCart() {
            this.$emit('delete-from-cart', this.variants[this.selectedVariant].variantsId);
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
        },
        shipping() {
            if (this.premium) {
                return "Бесплатно";
            } else {
                return "300р"
            }
        },
        filterDetails() {
            if (this.premium) {
                return ['80% хлопок', '20% полиэстер', 'Гендерно-нейтральный', 'Премиум качество'];
            } else {
                return ['80% хлопок', '20% полиэстер', 'Женские', 'Стандратное качество'];
            }
        }
    }
})
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details" :key="detail">{{ detail }}</li>
    </ul>
    `
})
Vue.component('product-review', {
    template: `
    <input>
    `,
    data() {
        return {
            name: null
        }
    }
})
let app = new Vue ({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        details: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart(id) {
            this.cart=this.cart.filter(item => item !== id);
        }
    }
})