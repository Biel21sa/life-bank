package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.DonorModel;
import br.fai.lds.lifebank.port.service.donor.DonorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/donor")
public class DonorRestController {

    private final DonorService donorService;

    public DonorRestController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping()
    public ResponseEntity<List<DonorModel>> getEntities() {
        List<DonorModel> entities = donorService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonorModel> getEntityById(@PathVariable final int id) {
        DonorModel entity = donorService.findByid(id);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        donorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<DonorModel> create(@RequestBody final DonorModel data) {
        final int id = donorService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonorModel> update(@PathVariable final int id, @RequestBody final DonorModel data) {

        DonorModel entity = data;
        donorService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}
