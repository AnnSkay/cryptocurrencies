import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// импорт хука состояния
import { useState } from 'react';
// импорт библиотеку axios
import axios from 'axios';
// импорт ссылки для экпорта файлов
import { CSVLink } from 'react-csv';


function GetCurrencies() {

  const [currencies, setCurrencies] = useState([]);
  const [showBtn, setShowBtn] = useState(false);

  // ассинхронный get-запрос с сайта api.nomics.com (в ссылке используется ключ, полученный бесплатно на сайте)
  const getList = async () => {
    const response = await axios.get(
      "https://api.nomics.com/v1/currencies/ticker?key=a0e4a056ac65fd6e6728bb185bf566d41ab4d114&interval=1d,30d&convert=USD&per-page=100&page=1"
    );

    // визуализация кнопки экспорта только после нажатия кнопки "Показать список"
    setShowBtn(true);

    // заполнение Currencies массивом объектов валют
    setCurrencies(response.data);
  };

  // названия заголовков в csv-файле
  const headersForCsv = [
    {label: "Name", key: "name"},
    {label: "Currency", key: "currency"},
    {label: "Price", key: "price"},
    {label: "Price change", key: "currency['1d'].price_change_pct"}
  ];

  // данные для выгрузки файла: список, заголовки и имя файла
  const csvReport = {
    data: currencies,
    headers: headersForCsv,
    filename: 'Currencies_Report.csv'
  };

  return (
    <div className="cryptocurrency">

      <h1>Список криптовалют</h1>

      <div>
        <button className="button" onClick={getList}>
          Показать список
        </button>
      </div>

      {showBtn ? (
          <div>
            <CSVLink {...csvReport}>
              <button className="button">
                Экспорт в CSV
              </button>
            </CSVLink>
          </div>
        ) : 
        null
      }
      
      {/*создание карточек криптовалют*/} 
      <div className="currencies">
        {currencies &&
          currencies.map((currency, index) => {
            const price = +currency.price;

            return (
              <div className="currency" key={index}>

                <div className="curr-header">
                  <h2>{currency.name}</h2>
                  <div>{currency.currency}</div>
                </div>

                <img src={currency.logo_url} alt={index} />

                <h3>
                  <span className="caption">Price: </span>
                  ${price.toFixed(3)}
                </h3>

                <h3>
                  <span className="caption">Price change: </span>
                  {currency['1d'].price_change_pct.substr(0,1) === '-' ? (
                      <span className="changeDown">{currency['1d'].price_change_pct}%</span>
                    ) : (
                      <span className="changeUpp">{currency['1d'].price_change_pct}%</span>
                    )
                  }
                </h3>
              
              </div>
            );
          })}
      </div>

    </div>
  );

}

const container = document.getElementById("root");
ReactDOM.render(
  <GetCurrencies />, 
  container
);