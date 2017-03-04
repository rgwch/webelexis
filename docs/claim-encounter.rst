Extension to map claims to encounters
=====================================

+------------+----------------------------------------------+
| Code       | "claim-encounter"                            |
+------------+----------------------------------------------+
|Context     | This Extension is used in the Claim resource.|
+------------+----------------------------------------------+
|Short defn  | Link a claim to the originating encounter    |
+------------+----------------------------------------------+
|Definition  | A Claim belongs to the hereby specified      |
|            | encounter                                    |
+------------+----------------------------------------------+
|Comments    | Value is a reference to an Encounter         |
+------------+----------------------------------------------+
|Cardinality | 1(There is exactly one Encounter for a Claim)|
+------------+----------------------------------------------+
|Type        | Reference                                    |
+------------+----------------------------------------------+
