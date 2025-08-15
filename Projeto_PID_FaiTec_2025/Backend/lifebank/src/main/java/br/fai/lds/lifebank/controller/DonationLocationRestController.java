package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.port.service.donationlocation.DonationLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/donationlocation")
public class DonationLocationRestController {

    private final DonationLocationService donationLocationService;

    public DonationLocationRestController(DonationLocationService donationLocationService) {
        this.donationLocationService = donationLocationService;
    }

    @GetMapping()
    public ResponseEntity<List<DonationLocationModel>> getEntities() {
        List<DonationLocationModel> entities = donationLocationService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationLocationModel> getEntityById(@PathVariable final int id) {
        DonationLocationModel entity = donationLocationService.findByid(id);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        donationLocationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<DonationLocationModel> create(@RequestBody final DonationLocationModel data) {
        final int id = donationLocationService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/`{id}")
    public ResponseEntity<DonationLocationModel> update(@PathVariable final int id, @RequestBody final DonationLocationModel data) {

        DonationLocationModel entity = data;
        donationLocationService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}
