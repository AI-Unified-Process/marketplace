package com.example.workshops.usecase;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks the journey test that automates a docs/test_cases/TC-XXX-*.md document and names the use cases its Flow
 * table links, in the order of their first row.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TestCase {

    String id();

    String[] useCases();

}
