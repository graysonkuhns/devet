package edu.ucmo.devet.db.dao;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import edu.ucmo.devet.db.mapper.RepositoryMapper;
import edu.ucmo.devet.model.Language;
import edu.ucmo.devet.model.Repository;
import org.eclipse.jetty.server.RequestLog;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.*;
import org.jdbi.v3.core.statement.StatementContext;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Singleton
public class RepositoryDAO {
    
    private final Jdbi jdbi;
    private final LanguageDAO languageDAO;
    private final RepositoryMapper repositoryMapper;

    @Inject
    public RepositoryDAO(Jdbi jdbi, LanguageDAO languageDAO, RepositoryMapper repositoryMapper) {
        this.jdbi = jdbi;
        this.languageDAO = languageDAO;
        this.repositoryMapper = repositoryMapper;

        // Register the mapper if it has not been already
        if (!jdbi.getConfig().get(RowMappers.class).findFor(Repository.class).isPresent()) {
            jdbi.registerRowMapper(repositoryMapper);
        }
    }
    
    public List<Repository> listTop5Repositories(String username){
        return jdbi.withHandle(handle -> handle
            .createQuery("SELECT * FROM repository WHERE owner = :owner ORDER BY stars DESC LIMIT 5")
            .bind("owner", username)
            .mapTo(Repository.class)
            .list());
    }
    
    public Map<String, Long> listLanguageCount(String username){
        Map<String, Long> languageCount = new HashMap<>();
        
        jdbi.useHandle(handle -> handle
            .createQuery("SELECT l.name, rl.byte_count FROM repository_language AS rl JOIN language AS l " +
                "WHERE l.id = rl.language AND rl.repository IN " +
                "(SELECT id FROM repository WHERE owner = :owner)")
            .bind("owner", username)
            .mapToBean(LanguageTuple.class)
            .list()
            .forEach(tuple -> {
                if(languageCount.containsKey(tuple.name)){
                    languageCount.put(tuple.name, languageCount.get(tuple.name) + tuple.byteCount);
                } else {
                    languageCount.put(tuple.name, tuple.byteCount);
                }
            }));
        
        return languageCount;
    }
    
    public static class LanguageTuple {
        private String name;
        private Long byteCount;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getByteCount() {
            return byteCount;
        }

        public void setByteCount(Long byteCount) {
            this.byteCount = byteCount;
        }
    }
}
