package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.domain.dto.DonationByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionByBloodTypeDto;
import br.fai.lds.lifebank.domain.dto.DonationEvolutionDto;
import br.fai.lds.lifebank.port.service.donation.DonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationRestController {

    private final DonationService donationService;

    public DonationRestController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping()
    public ResponseEntity<List<DonationModel>> getEntities() {
        List<DonationModel> entities = donationService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationModel> getEntityById(@PathVariable final int id) {
        DonationModel entity = donationService.findByid(id);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @GetMapping("/find-by-donor-cpf")
    public ResponseEntity<List<DonationModel>> getEntityByDonorCpf(@RequestBody final String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<DonationModel> entities = donationService.findByDonorCpf(cpf);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        donationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<DonationModel> create(@RequestBody final DonationModel data) {
        final int id = donationService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationModel> update(@PathVariable final int id, @RequestBody final DonationModel data) {

        DonationModel entity = data;
        donationService.update(id, entity);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/location/{id}")
    public ResponseEntity<List<DonationModel>> getEntityByDonationLocationId(@PathVariable final int id) {
        if (id == 0) {
            return ResponseEntity.badRequest().build();
        }

        List<DonationModel> entities = donationService.findByDonationLocationId(id);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<DonationModel>> getEntityByUserId(@PathVariable final int id) {
        if (id == 0) {
            return ResponseEntity.badRequest().build();
        }

        List<DonationModel> entities = donationService.findByUserId(id);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @GetMapping("/evolution/{donationLocationId}/{year}")
    public ResponseEntity<List<DonationEvolutionDto>> getDonationEvolution(@PathVariable final int donationLocationId,
                                                                           @PathVariable final int year) {
        if (donationLocationId == 0 || year == 0) {
            return ResponseEntity.badRequest().build();
        }

        List<DonationEvolutionDto> entities = donationService.getDonationEvolution(donationLocationId, year);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @GetMapping("/donations-by-blood-type/{donationLocationId}/{year}")
    public ResponseEntity<List<DonationByBloodTypeDto>> getDonationByBloodType(@PathVariable final int donationLocationId,
                                                                               @PathVariable final int year) {

        if (donationLocationId == 0 || year == 0) {
            return ResponseEntity.badRequest().build();
        }

        List<DonationByBloodTypeDto> entities = donationService.getDonationByBloodType(donationLocationId, year);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @GetMapping("/donation-evolution-by-type/{donationLocationId}/{year}")
    public ResponseEntity<List<DonationEvolutionByBloodTypeDto>> getDonationEvolutionByBloodType(@PathVariable final int donationLocationId,
                                                                                                 @PathVariable final int year) {

        if (donationLocationId == 0 || year == 0) {
            return ResponseEntity.badRequest().build();
        }

        List<DonationEvolutionByBloodTypeDto> entities = donationService.getDonationEvolutionByBloodType(donationLocationId, year);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }
}
