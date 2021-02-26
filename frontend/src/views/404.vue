<template >
  <v-container class="text-xs-center">
    <br />
    <br />
    <v-row class="text-center" row wrap>
      <v-col class="col-12">
        <div class="sign">
          <b style="font-size: 170px" class="fast-flicker">404</b>
        </div>
      </v-col>
      <v-col xs="12">
        <div class="sign">
          <b style="font-size: 80px" class="fast-flicker">Not Found Page</b>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="text/javascript">
export default {};
</script>

<style scoped>
.sign {
  letter-spacing: 2;
  /* font-family: "Clip"; */
  text-transform: uppercase;
  font-size: 6em;
  color: #cdcdff;
  text-shadow: 0 0 0.6rem #cdcdff, 0 0 1.5rem #6561d8,
    -0.2rem 0.1rem 1rem #6561d8, 0.2rem 0.1rem 1rem #6561d8;
  /* 0 -0.5rem 2rem #2b16c7, 0 0.5rem 3rem #2b16c7; */
  animation: shine 2s forwards, flicker 3s infinite;
}

@keyframes blink {
  0%,
  22%,
  36%,
  75% {
    color: #cdcdff;
    text-shadow: 0 0 0.6rem #cdcdff, 0 0 1.5rem #6561d8,
      -0.2rem 0.1rem 1rem #6561d8, 0.2rem 0.1rem 1rem #6561d8;
    /* 0 -0.5rem 2rem #2b16c7, 0 0.5rem 3rem #2b16c7; */
  }
  28%,
  33% {
    color: #6561d8;
    text-shadow: none;
  }
  82%,
  97% {
    color: #3f51b5;
    text-shadow: none;
  }
}

.flicker {
  animation: shine 2s forwards, blink 3s 2s infinite;
}

.fast-flicker {
  animation: shine 2s forwards, blink 10s 1s infinite;
}

@keyframes shine {
  0% {
    color: #3f51b5;
    text-shadow: none;
  }
  100% {
    color: #cdcdff;
    text-shadow: 0 0 0.6rem #cdcdff, 0 0 1.5rem #6561d8,
      -0.2rem 0.1rem 1rem #6561d8, 0.2rem 0.1rem 1rem #6561d8,
      0 -0.5rem 2rem #3f51b5, 0 0.5rem 3rem #3f51b5;
  }
}

@keyframes flicker {
  from {
    opacity: 1;
  }

  4% {
    opacity: 0.9;
  }

  6% {
    opacity: 0.85;
  }

  8% {
    opacity: 0.95;
  }

  10% {
    opacity: 0.9;
  }

  11% {
    opacity: 0.922;
  }

  12% {
    opacity: 0.9;
  }

  14% {
    opacity: 0.95;
  }

  16% {
    opacity: 0.98;
  }

  17% {
    opacity: 0.9;
  }

  19% {
    opacity: 0.93;
  }

  20% {
    opacity: 0.99;
  }

  24% {
    opacity: 1;
  }

  26% {
    opacity: 0.94;
  }

  28% {
    opacity: 0.98;
  }

  37% {
    opacity: 0.93;
  }

  38% {
    opacity: 0.5;
  }

  39% {
    opacity: 0.96;
  }

  42% {
    opacity: 1;
  }

  44% {
    opacity: 0.97;
  }

  46% {
    opacity: 0.94;
  }

  56% {
    opacity: 0.9;
  }

  58% {
    opacity: 0.9;
  }

  60% {
    opacity: 0.99;
  }

  68% {
    opacity: 1;
  }

  70% {
    opacity: 0.9;
  }

  72% {
    opacity: 0.95;
  }

  93% {
    opacity: 0.93;
  }

  95% {
    opacity: 0.95;
  }

  97% {
    opacity: 0.93;
  }

  to {
    opacity: 1;
  }
}
</style>