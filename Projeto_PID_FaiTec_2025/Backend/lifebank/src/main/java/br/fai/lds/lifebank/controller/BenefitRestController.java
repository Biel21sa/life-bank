package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.BenefitModel;
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

    @GetMapping("/user/{id}")
    public ResponseEntity<List<BenefitModel>> getEntityByUserId(@PathVariable final int id) {
        if (id == 0) {
            return ResponseEntity.badRequest().build();
        }

        List<BenefitModel> entities = benefitService.findByUserId(id);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @GetMapping("/donor/{cpf}")
    public ResponseEntity<List<BenefitModel>> getEntityByDonorCpf(@PathVariable final String cpf) {
        if (cpf == null) {
            return ResponseEntity.badRequest().build();
        }

        List<BenefitModel> entities = benefitService.findByDonorCpf(cpf);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BenefitModel> updateStatus(@PathVariable final int id) {
        if (id <= 0) {
            return ResponseEntity.badRequest().build();
        }

        benefitService.updateBenefitStatus(id);

        return ResponseEntity.noContent().build();
    }
}
