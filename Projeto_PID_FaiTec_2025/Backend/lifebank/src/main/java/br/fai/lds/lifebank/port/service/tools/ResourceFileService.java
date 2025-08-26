package br.fai.lds.lifebank.port.service.tools;

import java.io.IOException;

public interface ResourceFileService {
    String read(final String resourcePath) throws IOException;
}
