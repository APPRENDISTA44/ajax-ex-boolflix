$(document).ready(function () {

  //EVENTI

  //evento di ricerca film al click del bottone
  $(document).on('click','#button_search',
  function () {
    // do la possibilita di cercare solo se stringa non vuota
    if ($('#search').val().trim() != ''){
      ricerca();
    }

  });
  //evento di ricerca film al premere del tasto invio
  $('#search').keypress(function (event) {
    // do la possibilita di cercare solo se stringa non vuota
    if (event.which == 13 && $('#search').val().trim() != '') {
      ricerca();
    }
  });


  //FUNZIONI

  //funzione ricerca film
  //interrogo l'api per soddisfare la richiesta dell'utente
  //stampo i dati dei film trovati
  function ricerca(){
    reset();
    var titolo = $('#search').val();
    var urlFilm = "https://api.themoviedb.org/3/search/movie";
    var urlSeries = "https://api.themoviedb.org/3/search/tv";
    var api_key = "d7eedefaa54e5ee2ac1df8e212654266";
    //ricerca dei film
    ricercaContenuto(urlFilm,api_key,titolo,"Film")
    //ricerca delle serie tv
    ricercaContenuto(urlSeries,api_key,titolo,"Serie TV")
  }

  //funzione ricerca con chiamata ajax
  //PARAMETRO: url del server da chiamare, chiave dell'api
  //e stringa digitata dall'utente
   function ricercaContenuto(url,api_key,titolo,type) {
     $.ajax({
       url : url,
       data : {
         "api_key" : api_key,
         "query" : titolo,
         "language" : "it-IT"
       },
       method : "GET",
       success : function (data) {
         console.log(data.results);
         stampa(data.results,type,api_key)
       },
       error : function() {
           errore("Si è verificato un errore");
       }
     });
   }
  //funzione di supporto che stampa i film e serie tv dalla barra di ricerca
  //PARAMETRO: array di oggetti ritornato dall'api e tipologia di contenuto
  function stampa(arrayOggetti,tipo,api_key) {
    if (arrayOggetti.length === 0) {
      errore(tipo);
    }else {
      for (var i = 0; i < arrayOggetti.length; i++) {
        //trasfotmo prima il voto per visualizzare stelle
        var voto = trasformaVoto(arrayOggetti[i].vote_average);
        //trasformo lingua con bandiera corrispondente
        bandiera = trasformaLingua(arrayOggetti[i].original_language);
        var titolo;
        var titolo_originale;
        var id = arrayOggetti[i].id;
        if (tipo === "Film") {
          titolo = arrayOggetti[i].title;
          titolo_originale = arrayOggetti[i].original_title
        }else if (tipo === "Serie TV") {
          titolo = arrayOggetti[i].name;
          titolo_originale = arrayOggetti[i].original_name
        }
        var context = {
          "copertina" : stampaCopertina(arrayOggetti[i].poster_path),
          "title" : titolo,
          "original_title" : titolo_originale,
          "original_language" : bandiera,
          "vote_average" : voto,
          "overview" : arrayOggetti[i].overview
        };
        aggiungiDettagli(id,tipo,api_key,context)
      }
    }
    //pulisco la barra di ricerca
    $('#search').val('');
  }

  //funzione che aggiunge i generi dell'opera in esame e chiama funzione
  //per trovare i primi 5 autori
  //PARAMETRI: id del contenuto in esame, tipo del contenuto in esame,
  //api_key e oggetto context utile a handlebars
  function aggiungiDettagli(id,type,api_key,context) {
    var url;
    if (type === "Film") {
      url = 'https://api.themoviedb.org/3/movie/' + id;
    }else if (type === "Serie TV") {
      url = 'https://api.themoviedb.org/3/tv/' + id;
    }
    $.ajax({
      url : url,
      data : {
        "api_key" : api_key,
        "language" : "it-IT"
      },
      method : "GET",
      success : function (data) {
        var genres = [];
        // console.log(data);
        var arrayGeneri = data.genres;
        for (var i = 0; i < arrayGeneri.length; i++) {
         genres.push(arrayGeneri[i].name);
        }
        context.genres = genres;
        aggiungiDettagliAutori(url,api_key,context,type)
      },
      error : function() {
          errore("Si è verificato un errore");
      }
    });
  }

  //funzione che trova i primi 5 autori e va a stampare contenuto completo
  //PARAMETRI: url per chiamata ajax, api_key
  //oggetto context utile a handlebars e tipo del contenuto in esame

  function aggiungiDettagliAutori(url,api_key,context,type){
    $.ajax({
      url : url + '/credits',
      data : {
        "api_key" : api_key,
        "language" : "it-IT"
      },
      method : "GET",
      success : function (data) {
        var actors = [];
        var arrayAttori = data.cast;
        for (var i = 0; i < 5 && i < arrayAttori.length ; i++) {
          actors.push(arrayAttori[i].name)
        }
        context.actors = actors;
        var source = $('#lista-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        if (type === "Film") {
          $('#objectsFilm').append(html);
        }else if (type === "Serie TV") {
          $('#objectsSerieTV').append(html);
        }

      },
      error : function() {
          errore("Si è verificato un errore");
      }
    });
  }





  //messaggio in caso la ricerca non dia risultati
  //PARAMETRO: tipo di contenuto, film o serie tv
  function errore(tipo) {
    var source = $('#errore-template').html();
    var template = Handlebars.compile(source);
    var context = {
      "errore" : "la ricerca non ha prodotto risultati nella sezione " + tipo
    }
    var html = template(context);
    if (tipo === "Film") {
      $('#objectsFilm').append(html);
    }else if (tipo === "Serie TV") {
      $('#objectsSerieTV').append(html);
    }
  }

  //pulisco i risultati precdenti
  function reset() {
    $('#objectsFilm').html('');
    $('#objectsSerieTV').html('');
  }
  //trasfotmo il voto decimale in una scala da 0 a 5 e ritorno le stelle corrispondenti
  //PARAMETRO: voto in decimale
  //RETURN: rappresentazione con stelle
  function trasformaVoto(numero){
    numero = Math.ceil(numero/2);
    var stelle = '';
    for (var i = 0; i < numero; i++) {
      stelle += "<i class=\"fas fa-star\"></i>";
    }
    for (var i = 0; i < 5-numero; i++) {
      stelle += "<i class=\"far fa-star\"></i>";
    }
    return stelle;
  }
  //trasformo la lingua dell'oggetto da stringa a bandiera, se disponibile
  //PARAMETRO: lingua originale del contenuto
  //RETURN: immagine della bandiera se disponibile, altrimenti parametro immutato
  function trasformaLingua(lingua) {
    var contenitoreLingue = ["it","en","fr"]
    var bandiera = lingua;
    if (contenitoreLingue.includes(lingua)) {
      bandiera = '<img src="img/' + lingua + '.png" alt="' + lingua + '">';
    }
    return bandiera;
  }
  //effettua controllo sulla copertina, se esiste crea url completo, altrimenti
  //viene mostrata un'immagine di defaul
  //PARAMETRO: parte finale dell'url dell'immagine
  //RETURN: url immagine da mostrare
  function stampaCopertina(url){
    var finalUrl;
    if (url === null) {
      finalUrl = "https://static.vecteezy.com/system/resources/previews/000/440/467/non_2x/question-mark-vector-icon.jpg"
    }else {
      finalUrl = "https://image.tmdb.org/t/p/" + "w342" + url;
    }
    return finalUrl;
  }
});
