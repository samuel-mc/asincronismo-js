const COUNTRY = 'mx';
const API_KEY = '3e2a6fba193349e6bd6f3bb53fb2b986';
const POSIBLE_CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
let articles = [];

const fetchNews = async (category) => {
    const URL_API = `https://newsapi.org/v2/top-headlines?country=${COUNTRY}&apiKey=${API_KEY}&category=${category}`;
    const response = await fetch(URL_API);
    const data = await response.json();
    
    if (data?.status == 'ok') {
        return data?.articles;
    } else {
        throw new Error('Ocurrio un error al consultar la información.');
    }
};

const closeDialog = () => {
    const dialogNew = document.getElementById('dialogNew');
    dialogNew.classList.add('hidden');
}

const seeMore = (article) => {
    let articleSelected = null;
    articleSelected = articles[article - 1];
    console.log(articleSelected);       

    const dialogNew = document.getElementById('dialogNew');
    dialogNew.classList.remove('hidden');

    dialogNew.innerHTML = `
    <div class="dialog__content">
        <div class="text-right">
            <button onclick="closeDialog()">x</button>
        </div>
        <h2 class="text-lg font-bold mb-6">${articleSelected?.title || ''}</h2>
        <h4 class="text-md mb-3">Por ${articleSelected?.author || ''} - ${articleSelected?.publishedAt || ''}</h4>
        <img src="${articleSelected?.urlToImage}" />
        <p class="my-6">
            ${articleSelected?.description}
        </p>
        <span class="mt-8">Fuente: <a href="${articleSelected?.url}" class="article--url">${articleSelected?.url}</a> </span>

    </div>
    `;
}

const styleSelectedButton = (category) => {
    const buttons = document.getElementsByClassName('header__button');
    Array.from(buttons).forEach((button) => {
        button.classList.remove('active');

        if (button.getAttribute('id') === `${category}Button`) {
            console.log('es el mismo');
            button.classList.add('active');
        }
    });
}

const handleSelectCategory = async (category) => {
    styleSelectedButton(category);
    const fetchedArticles = await fetchNews(category);
    renderNews(fetchedArticles);
    articles = [...fetchedArticles];
}

const renderHeader = () => {
    const header = document.getElementById('header');
    POSIBLE_CATEGORIES.forEach(category => {
        const button = document.createElement('button');
        button.id = `${category}Button`
        button.classList.add('header__button')
        button.innerText = category;
        button.addEventListener('click', () => {
            handleSelectCategory(category);
        })

        header.appendChild(button);
    })
}

const renderNews = (articles) => {
    let totalArticles = 0;
    const MAX_ARTICLES = 20;

    const newsCarousel = document.getElementById('newsCarousel');
    newsCarousel.innerHTML = '';
    articles.forEach(article => {
        totalArticles ++;
        if (totalArticles > MAX_ARTICLES) return;
        const div = document.createElement('div');
        div.classList.add('carousel__item');
        div.innerHTML = `
            <img src="${article?.urlToImage}" />
            <div class="item__content">
                <div>
                    <h4 class="font-bold text-md">${article?.title || ''}</h4>
                    <h5 class="text-md my-1">(${article?.author || ''})</h5>
                </div>
                <div class="text-center">
                    <button class="learn-more" onclick="seeMore(${totalArticles})">
                        <span class="circle" aria-hidden="true">
                        <span class="icon arrow"></span>
                        </span>
                        <span class="button-text">Ver más</span>
                    </button>
                </div>
            </div>
        `

        newsCarousel.appendChild(div);
    });
}


(async () => {
    renderHeader();
    try {
        await handleSelectCategory('general');
    } catch (error) {
        console.error(error);
    }
})();