package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.BenefitModel;
import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.DonationModel;
import br.fai.lds.lifebank.port.service.benefit.BenefitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/benefit")
public class BenefitRestController {

    private final BenefitService benefitService;

    public BenefitRestController(BenefitService benefitService) {
        this.benefitService = benefitService;
    }

    @GetMapping()
    public ResponseEntity<List<BenefitModel>> getEntities() {
        List<BenefitModel> entities = benefitService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BenefitModel> getEntityById(@PathVariable final int id) {
        BenefitModel entity = benefitService.findByid(id);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @GetMapping("/find-by-clinic-id")
    public ResponseEntity<List<BenefitModel>> getEntityByClinicId(@RequestBody final int clinicId) {
        if (clinicId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        List<BenefitModel> entities = benefitService.findByClinicId(clinicId);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        benefitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<BenefitModel> create(@RequestBody final BenefitModel data) {
        final int id = benefitService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/`{id}")
    public ResponseEntity<BenefitModel> update(@PathVariable final int id, @RequestBody final BenefitModel data) {

        BenefitModel entity = data;
        benefitService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}
