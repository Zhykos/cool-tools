package fr.zhykos.cool.tools;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Geolocation{
    private String iso2;
    private String iso3;
    private String country_code;
    private String name;
}
