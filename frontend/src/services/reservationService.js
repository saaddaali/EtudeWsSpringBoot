import axios from "axios";

const API_URL = "http://localhost:8080/services/ws";

const createSoapEnvelope = (method, params) => `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                    xmlns:hot="http://controller.hotelgestion.example.com/">
    <soapenv:Header/>
    <soapenv:Body>
      <hot:${method}>${params}</hot:${method}>
    </soapenv:Body>
  </soapenv:Envelope>
`;

export const reservationService = {
  async getReservations() {
    try {
      const response = await axios.post(
        API_URL,
        createSoapEnvelope("getAllReservations", ""),
        { headers: { "Content-Type": "text/xml" } }
      );
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      return this.transformReservations(xmlDoc);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      throw new Error("Erreur SOAP lors du chargement");
    }
  },

  async getReservationById(id) {
    try {
      const params = `<id>${id}</id>`;
      const response = await axios.post(
        API_URL,
        createSoapEnvelope("getReservationById", params),
        { headers: { "Content-Type": "text/xml" } }
      );
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      return this.transformReservation(xmlDoc.querySelector("return"));
    } catch (error) {
      console.error("Erreur lors de la récupération de la réservation:", error);
      throw new Error("Erreur SOAP lors de la récupération");
    }
  },

  async createReservation(formData) {
    try {
      const [firstName, ...lastNameParts] = formData.clientName.split(" ");
      const params = `
        <dateDebut>${formData.startDate}</dateDebut>
        <dateFin>${formData.endDate}</dateFin>
        <client>
          <nom>${lastNameParts.join(" ")}</nom>
          <prenom>${firstName}</prenom>
          <email>${formData.email}</email>
          <telephone>${formData.phone}</telephone>
        </client>
        <chambre>
          <type>${formData.roomType}</type>
          <disponible>true</disponible>
        </chambre>
      `;

      const response = await axios.post(
        API_URL,
        createSoapEnvelope("createReservation", params),
        { headers: { "Content-Type": "text/xml" } }
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");

      // Vérifier les erreurs SOAP
      const faultElement = xmlDoc.querySelector("soap\\:Fault, Fault");
      if (faultElement) {
        throw new Error("Erreur SOAP lors de la création");
      }

      return this.transformReservation(xmlDoc);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      throw error;
    }
  },

  async updateReservation(id, formData) {
    try {
      const [firstName, ...lastNameParts] = formData.clientName.split(" ");
      // Enlever le wrapper arg0 et mettre les éléments directement
      const params = `
        <id>${id}</id>
        <dateDebut>${formData.startDate}</dateDebut>
        <dateFin>${formData.endDate}</dateFin>
        <client>
          <nom>${lastNameParts.join(" ")}</nom>
          <prenom>${firstName}</prenom>
          <email>${formData.email}</email>
          <telephone>${formData.phone}</telephone>
        </client>
        <chambre>
          <type>${formData.roomType}</type>
          <disponible>true</disponible>
        </chambre>
      `;

      const response = await axios.post(
        API_URL,
        createSoapEnvelope("updateReservation", params),
        { headers: { "Content-Type": "text/xml" } }
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");

      const faultElement = xmlDoc.querySelector("soap\\:Fault, Fault");
      if (faultElement) {
        const faultString =
          faultElement.querySelector("faultstring")?.textContent;
        throw new Error(faultString || "Erreur SOAP lors de la mise à jour");
      }

      const result = xmlDoc.querySelector("return");
      if (!result || result.textContent !== "true") {
        throw new Error("Erreur SOAP lors de la mise à jour");
      }

      return true;
    } catch (error) {
      console.error("Détails de l'erreur SOAP:", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  },
  async deleteReservation(id) {
    try {
      const params = `<id>${id}</id>`;
      const response = await axios.post(
        API_URL,
        createSoapEnvelope("deleteReservation", params),
        { headers: { "Content-Type": "text/xml" } }
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");

      const result = xmlDoc.querySelector("return");
      if (!result || result.textContent !== "true") {
        throw new Error("Erreur SOAP lors de la suppression");
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation:", error);
      throw error;
    }
  },

  transformReservation(node) {
    if (!node) return null;

    const getNodeValue = (node, path) => {
      const element = node.querySelector(path);
      return element ? element.textContent : "";
    };

    return {
      id: getNodeValue(node, "id"),
      clientName: `${getNodeValue(node, "prenom")} ${getNodeValue(
        node,
        "nom"
      )}`.trim(),
      email: getNodeValue(node, "email"),
      phone: getNodeValue(node, "telephone"),
      roomType: getNodeValue(node, "type"),
      startDate: getNodeValue(node, "dateDebut"),
      endDate: getNodeValue(node, "dateFin"),
      preferences: getNodeValue(node, "preferences") || "",
    };
  },

  transformReservations(xmlDoc) {
    const reservations = xmlDoc.querySelectorAll("return");
    return Array.from(reservations).map((res) =>
      this.transformReservation(res)
    );
  },
};
