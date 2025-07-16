# 🌤️ Hava Durumu 

Bu proje, jQuery kullanılarak geliştirilmiş modern bir **hava durumu tahmin** uygulamasıdır. Kullanıcı, dilediği şehir adını girerek güncel hava durumu ve 5 günlük tahmin bilgilerine ulaşabilir.
> [Insider & Testinium Tech Hub Bootcamp'25 kapsamında yapılmıştır.]
  

### Başlangıç Ekranı

<img width="1911" height="937" alt="w1" src="https://github.com/user-attachments/assets/30dab7ad-5415-44d7-ab8d-2d47f362fd13" />


### Hava Durumu Görüntülendiğinde

<img width="1896" height="945" alt="w2" src="https://github.com/user-attachments/assets/f8748331-81ee-4b2c-bcd7-33b31955f2df" />


### Hatalı Giriş

<img width="1867" height="905" alt="w3" src="https://github.com/user-attachments/assets/891e0254-fddc-436c-a1a7-1a2f05cd943f" />


## 🚀 Özellikler

- Şehir adı girilerek **güncel hava durumu** gösterilir
- **5 günlük tahmin** öğle saatleri (12:00 - 18:00) baz alınarak sunulur
- Kullanıcı dostu ve mobil uyumlu modern arayüz
- Hatalı şehir girildiğinde kullanıcı bilgilendirilir
- Arka planda `OpenWeatherMap API` kullanır

## Kullanılan Teknolojiler

- HTML5 + CSS3
- JavaScript (jQuery)
- OpenWeatherMap API
- Google Fonts – [Roboto](https://fonts.google.com/specimen/Roboto)


## 🌐 API Bilgisi

Uygulama, hava durumu verilerini **OpenWeatherMap** API üzerinden almaktadır.  
API anahtarınızı edinmek için [openweathermap.org](https://openweathermap.org/) adresinden ücretsiz kayıt olabilirsiniz.

### Kullanılan Endpoint'ler:

- **Güncel hava durumu:**  
  `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=tr`

- **5 günlük hava tahmini:**  
  `https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric&lang=tr`

📌 **Not:** API anahtarınız `app.js` dosyasında `"API_KEY"` değişkenine tanımlanmalıdır.

---

##  jQuery ile API Entegrasyonu

jQuery ile aynı anda iki API isteği yapılmakta ve veriler DOM’a yazdırılmaktadır.  
İşte kullanılan AJAX yapısı:

```js
$.when(
    $.get(currentWeatherUrl),
    $.get(forecastUrl)
)
.then(function(currentDataResponse, forecastDataResponse) {
    const currentData = currentDataResponse[0];
    const forecastData = forecastDataResponse[0];
    displayCurrentWeather(currentData);
    displayForecast(forecastData);
}, function(jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 404) {
        $('#errorMessage').text('Belirtilen şehir bulunamadı.').show();
    } else {
        $('#errorMessage').text('Veri alınırken bir hata oluştu.').show();
    }
});

