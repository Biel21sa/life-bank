package br.fai.lds.lifebank.controller;

import br.fai.lds.lifebank.domain.BloodStockModel;
import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.domain.dto.UpdateLimitsBloodStockDto;
import br.fai.lds.lifebank.port.service.bloodstock.BloodStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-stock")
public class BloodStockRestController {

    private final BloodStockService bloodStockService;

    public BloodStockRestController(BloodStockService bloodStockService) {
        this.bloodStockService = bloodStockService;
    }

    @GetMapping("/location/{id}")
    public ResponseEntity<List<BloodStockModel>> getEntityByDonationLocationId(@PathVariable final int id) {
        if (id == 0) {
            return ResponseEntity.badRequest().build();
        }

        List<BloodStockModel> entities = bloodStockService.findByDonationLocationId(id);

        return entities.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(entities);
    }

    @PutMapping("/{id}/limits")
    public ResponseEntity<BloodStockModel> update(@RequestBody final UpdateLimitsBloodStockDto data) {

        bloodStockService.updateLimits(data);

        return ResponseEntity.noContent().build();
    }
}
