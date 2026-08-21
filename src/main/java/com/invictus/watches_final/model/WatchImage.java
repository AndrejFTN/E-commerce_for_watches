package com.invictus.watches_final.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchImage {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID imageID;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watchID", nullable = false)
    private Watch watch;

    @Lob
    private byte[] image;

    private String contentType;

    private boolean isPrimary;

}
