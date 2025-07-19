package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.BloodModel;
import br.fai.lds.lifebank.domain.enuns.BloodType;
import br.fai.lds.lifebank.port.service.blood.BloodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/blood")
public class BloodRestController {

    private final BloodService bloodService;

    public BloodRestController(BloodService bloodService) {
        this.bloodService = bloodService;
    }

    @GetMapping()
    public ResponseEntity<List<BloodModel>> getEntities() {
        List<BloodModel> entities = bloodService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodModel> getEntityById(@PathVariable final int id) {
        BloodModel entity = bloodService.findByid(id);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @GetMapping("/find-by-blood-type")
    public ResponseEntity<BloodModel> getEntityByBloodType(@RequestBody final BloodType bloodType) {
        BloodModel entity = bloodService.findByType(bloodType);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        bloodService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<BloodModel> create(@RequestBody final BloodModel data) {
        final int id = bloodService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/`{id}")
    public ResponseEntity<BloodModel> update(@PathVariable final int id, @RequestBody final BloodModel data) {

        BloodModel entity = data;
        bloodService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}
