let eventBus = new Vue()
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
});
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
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
            <div
                class="color-box"
                v-for="(variant, index) in variants" 
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)">
             </div>
            <div class="product-sizes">
                <div class="size" v-for="size in sizes">{{ size }}</div>
            </div>
            <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Добавить в корзину</button>
            <button v-on:click="deleteFromCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Удалить из карзины</button>
            <div class="moreProducts">
                <a :href="link">Больше подобных товаров</a>
            </div>
        </div>
        <div class="Review-Block">
            <product-tabs :reviews="reviews":shipping="shipping" :details="filterDetails"> @review-submitted="addReview"></product-tabs>
        </div>
    </div>
    `,
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
            cart: [],
            reviews: []
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
        },
        addReview(productReview) {
            this.reviews.push(productReview)
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
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }
})
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
          <p v-if="errors.length">
            <b>Пожалуйста, исправьте следующие ошибки:</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <p>
            <label for="name">Имя:</label>
            <input id="name" v-model="name" placeholder="Петя">
        </p>
    
        <p>
            <label for="review">Отзыв:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
    
        <p>
            <label for="rating">Оценка:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>Вы бы порекомендовали этот продукт?</p>
        <div class="recomendate">
            <div>
                <input type="radio" id="yes" name="contact" value="Да" v-model="question"/>
                <label for="yes">Да</label>
            </div>
            <div>
                <input type="radio" id="no" name="contact" value="Нет" v-model="question"/>
                <label for="no">Нет</label>
            </div>
        </div>
        <p>
            <input type="submit" value="Отправить"> 
        </p>
    </form>   
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.question) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    question: this.question
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.question = null;
                this.errors = [];
            } else {
                if(!this.name) this.errors.push("Требуется имя.");
                if(!this.review) this.errors.push("Требуется отзыв.");
                if(!this.rating) this.errors.push("Требуется оценка.");
                if(!this.question) this.errors.push("Требуется рекомендация.");
            }
        }
    }
})
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <ul>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab,index) in tabs" 
                @click="selectedTab = tab"
                >{{ tab }}</span>
        </ul>
        
        <!-- Новая кнопка для вызова модального окна -->
        <button v-show="selectedTab === 'Отзывы'" @click="showModal = true">Оставить отзыв</button>

        <!-- Модальное окно -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <span class="close-modal" @click="showModal = false">&times;</span>
                <product-review @review-submitted="onReviewSubmitted"></product-review>
            </div>
        </div>

        <div class="review-div" v-show="selectedTab === 'Отзывы'">
            <ul>
                <p v-if="!reviews.length" class="noneReviews">Здесь ещё нет отзывов.</p>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Оценка: {{ review.rating }}</p>
                    <p>Комментарий: {{ review.review }}</p>
                    <p>Рекомендовано: {{ review.question }}</p>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab === 'Доставка'">
            <p>Доставка: {{ shipping }}</p>
        </div>
        <div class="detail" v-show="selectedTab === 'Характеристики'">
            <h2>Характеристики:</h2>
            <product-details :details="details"></product-details>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Отзывы','Доставка', 'Характеристики'],
            selectedTab: 'Отзывы',
            showModal: false // Новое свойство для отслеживания состояния модального окна
        }
    },
    methods: {
        onReviewSubmitted(productReview) {
            this.$emit('review-submitted', productReview);
            this.showModal = false; // Закрываем модальное окно после отправки отзыва
        }
    }
})

// В компоненте product-review добавляем событие для закрытия модального окна
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
          <p v-if="errors.length">
            <b>Пожалуйста, исправьте следующие ошибки:</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <p>
            <label for="name">Имя:</label>
            <input id="name" v-model="name" placeholder="Петя">
        </p>
    
        <p>
            <label for="review">Отзыв:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
    
        <p>
            <label for="rating">Оценка:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>Вы бы порекомендовали этот продукт?</p>
        <div class="recomendate">
            <div>
                <input type="radio" id="yes" name="contact" value="Да" v-model="question"/>
                <label for="yes">Да</label>
            </div>
            <div>
                <input type="radio" id="no" name="contact" value="Нет" v-model="question"/>
                <label for="no">Нет</label>
            </div>
        </div>
        <p>
            <input type="submit" value="Отправить"> 
        </p>
    </form>   
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            question: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.question) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    question: this.question
                };
                this.$emit('review-submitted', productReview); // Отправляем событие наверх
                this.name = null;
                this.review = null;
                this.rating = null;
                this.question = null;
                this.errors = [];
            } else {
                if(!this.name) this.errors.push("Требуется имя.");
                if(!this.review) this.errors.push("Требуется отзыв.");
                if(!this.rating) this.errors.push("Требуется оценка.");
                if(!this.question) this.errors.push("Требуется рекомендация.");
            }
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