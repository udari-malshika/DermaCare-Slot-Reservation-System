const treatments = {
  "Laser Hair Removal": {
    intro: "Safe, effective hair reduction planned around your skin type and treatment area.",
    description: "Laser Hair Removal uses focused light energy to target hair follicles and reduce unwanted hair over a guided course of sessions.",
    indications: "Facial hair, underarms, legs, arms, back, and other suitable face or body areas.",
    duration: "30–60 min",
    image: "Images/CO2 laser.jpg"
  },
  "RF Microneedling": {
    intro: "A collagen-focused treatment for firmer texture and smoother-looking skin.",
    description: "RF Microneedling combines controlled microneedling with radio-frequency energy to support collagen remodeling in deeper skin layers.",
    indications: "Acne scars, enlarged pores, fine lines, uneven texture, and mild skin laxity.",
    duration: "60 min",
    image: "Images/RF microneedling.jpg"
  },
  "PRP Therapy": {
    intro: "Platelet-rich plasma care designed to support natural skin and hair rejuvenation.",
    description: "PRP Therapy uses a small sample of your own blood to prepare concentrated plasma, which is applied or injected as part of a personalized treatment plan.",
    indications: "Hair thinning, early hair loss, dull skin, fine lines, and overall skin rejuvenation.",
    duration: "45 min",
    image: "Images/PRP therepy.jpg"
  },
  "Chemical Peeling": {
    intro: "Custom exfoliation to brighten tone and improve acne-prone texture.",
    description: "A professionally selected peel removes dull surface cells and supports a clearer, smoother-looking complexion with an appropriate recovery plan.",
    indications: "Acne, post-acne marks, uneven tone, dullness, and rough skin texture.",
    duration: "30 min",
    image: "Images/chemical peeling.jpg"
  },
  "Botox & Fillers": {
    intro: "Subtle, natural-looking enhancement with an assessment-led treatment plan.",
    description: "Injectable treatments can soften selected expression lines or restore balanced volume while keeping your facial expression natural.",
    indications: "Expression lines, selected wrinkles, facial contouring, and volume loss.",
    duration: "30 min",
    image: "Images/botox & filler.jpg"
  }
};

const requestedTreatment = new URLSearchParams(window.location.search).get("treatment");
const treatment = treatments[requestedTreatment] || treatments["RF Microneedling"];
const treatmentName = requestedTreatment && treatments[requestedTreatment] ? requestedTreatment : "RF Microneedling";
const appointmentUrl = `appointment.html?treatment=${encodeURIComponent(treatmentName)}`;

document.title = `${treatmentName} | DermaCare`;
document.getElementById("treatmentName").textContent = treatmentName;
document.getElementById("treatmentIntro").textContent = treatment.intro;
document.getElementById("treatmentDescription").textContent = treatment.description;
document.getElementById("treatmentIndications").textContent = treatment.indications;
document.getElementById("treatmentDuration").textContent = treatment.duration;
document.getElementById("treatmentImage").src = treatment.image;
document.getElementById("treatmentImage").alt = `${treatmentName} treatment`;
document.getElementById("bookButton").href = appointmentUrl;
document.getElementById("bottomBookButton").href = appointmentUrl;
