package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.ClinicModel;
import br.fai.lds.lifebank.port.service.clinic.ClinicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/clinic")
public class ClinicRestController {

    private final ClinicService clinicService;

    public ClinicRestController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @GetMapping()
    public ResponseEntity<List<ClinicModel>> getEntities() {
        List<ClinicModel> entities = clinicService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClinicModel> getEntityById(@PathVariable final int id) {
        ClinicModel entity = clinicService.findByid(id);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @GetMapping("/find-by-cnpj")
    public ResponseEntity<ClinicModel> getEntityByCnpj(@RequestBody final String cnpj) {
        ClinicModel entity = clinicService.findByCnpj(cnpj);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        clinicService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ClinicModel> create(@RequestBody final ClinicModel data) {
        final int id = clinicService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClinicModel> update(@PathVariable final int id, @RequestBody final ClinicModel data) {

        ClinicModel entity = data;
        clinicService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}
