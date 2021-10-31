//Script composant de l'en-tete/header
const EnTete = {
  data() {
    return {
      nomAppli: "Mytho-France",
    };
  },

  template: `
      <header>
          <h1 class="title">{{nomAppli}}</h1>
          <h2 class="slogan">
            La météo où que vous soyez,<br> <span> à partir du moment où vous êtes en France hein...</span>
          </h2>
        </header>
        `,
};

const BlocPrevision = {
  props: {
    jourHeure: String,
    description: String,
    icone: String,
    temperature: Number,
    ressentie: Number,
    tempMini: Number,
    tempMaxi: Number,
    vent: Number,
  },

  template: `
    <div class="carteP">
        <h4>{{jourHeure}}</h4>
        <img :src="'http://openweathermap.org/img/wn/'+icone+'@2x.png'"/>
        <p>{{description}}</p>
        <p>Température : {{temperature}}°C</p>
        <p>Température ressentie : {{ressentie}}°C</p>
        <p>Température min/max : {{tempMini}}°C/ {{tempMaxi}}°C</p>
        <p>Vent : {{vent}}km/h</p>
    </div>
    `,
};

const Root = {
  components: {
    EnTete: EnTete,
    BlocPrevision: BlocPrevision,
  },

  data() {
    return {
      ville: "",
      donneesMeteo: [],
    };
  },

  async mounted() {
    let resultat = await fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=paris&appid=d702eb5b08d3b82818b032afe081d5fa&units=metric&lang=fr"
    );
    let donnees = await resultat.json();
    console.log(donnees);
    this.ville = donnees.city.name;
    this.donneesMeteo = donnees.list;
  },

  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition(async (geoloc) => {
        console.log(geoloc);
        const longitude = geoloc.coords.longitude;
        const latitude = geoloc.coords.latitude;
        let resultat = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=d702eb5b08d3b82818b032afe081d5fa&units=metric&lang=fr`
        );
        let donnees = await resultat.json();

        this.ville = donnees.city.name;
        this.donneesMeteo = donnees.list;
      });
    },
  },

  template: `
<EnTete></EnTete>
<div class="content">
    <h2>Voici les prévisions météorologiques des 5 prochains jours pour la ville de {{ville}}</h2>
    <div class="bandeauPrevision">
        <BlocPrevision
        v-for="prevision in donneesMeteo"

        :jourHeure="prevision.dt_txt"
        :icone="prevision.weather[0].icon"
        :description="prevision.weather[0].description"
        :temperature="prevision.main.temp"
        :ressentie="prevision.main.feels_like"
        :tempMini="prevision.main.temp_min"
        :tempMaxi="prevision.main.temp_max"
        :vent="prevision.wind.speed"
        >
        </BlocPrevision>
    </div>


    <div class="geoloc">
        <p>Ou je me géolocalise :</p>
        <button class="boutton" @click="geolocate">Géolocalisation</button>
    </div>
</div>



`,
};

//Création à partir du component Root et Montage à partir de la div #root
Vue.createApp(Root).mount("#root");
