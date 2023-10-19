<template>
    <div class="unsupported-mobile">
        <v-img max-width="280px" max-height="280px" :src="require('../assets/images/Bitak-logos_transparent.png')"
            alt="Company Logo" class="company-logo" />
        <div class="message-container">
            <h2>We're Sorry, but Mobile Devices Are Not Supported</h2>
            <p>
                Our application is best experienced on larger screens. Unfortunately, your current device's screen size
                doesn't meet our minimum requirements.
            </p>
            <p>
                For the best experience, please access our application from a desktop computer, laptop, or tablet.
            </p>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'MobileUnsupported',
};
</script>
  
<style scoped>
.unsupported-mobile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #333;
    /* Dark background color */
    color: #fff;
    /* Text color */
}

.company-logo {
    max-width: 50%;
    margin-bottom: 20px;
}

.message-container {
    text-align: center;
    max-width: 80%;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

p {
    font-size: 1.2rem;
    margin: 10px 0;
}
</style>
  