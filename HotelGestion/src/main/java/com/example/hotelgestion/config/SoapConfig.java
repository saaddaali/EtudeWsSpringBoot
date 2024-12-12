package com.example.hotelgestion.config;

import com.example.hotelgestion.controller.ReservationSoapController;
import lombok.AllArgsConstructor;
import org.apache.catalina.filters.CorsFilter;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class SoapConfig {

    private ReservationSoapController ReservationSoapController;
    private Bus bus;

    @Bean
    public EndpointImpl endpoint() {
        EndpointImpl endpoint = new EndpointImpl(bus, ReservationSoapController);
        endpoint.publish("/ws");
        return endpoint;
    }
}
