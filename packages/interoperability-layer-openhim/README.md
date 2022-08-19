
# Interoperability Layer - OpenHIM

OpenHIM is an interoperability layer, performing the core functions, as quoted by [OpenHIM's website](http://openhim.org/):

```yml
- Standardised audit trail logging: each message that is received from a client should be logged (stored in its entirety with metadata) and audited (store key information about that transaction, who created it and when it was created).

- Security Management: authentication and authorisation at a systems level

- Console: this displays real time transaction details to enable a system administrator to monitor the operations of the HIE

- Error Management: Provides the ability for a system administrator to resolve errors and re-run transactions
```

Openhim comprises two components:

- Openhim Core - the backend service
- Openhim Console - the frontend service

## Running in Dev Mode

When running in dev mode, the `OpenHIM Console` is reachable at:

>`http://localhost:9000/`

## Configuration Importing

To configure OpenHIM, a helper container is launched to import a config file to OpenHIM. The config importer looks for a filed named `openhim-import.json` in `<path to project packages>/interoparibility-layer-openhim/importer`.

## Backup restore

### Single node

[Single node restore docs](https://www.mongodb.com/docs/v4.2/tutorial/backup-and-restore-tools/)

The following job may be used to set up a backup job for a single node mongo

```ini
[job-run "mongo-backup"]
schedule= @every 24h
image= mongo:4.2
network= mongo_backup
volume= /backups:/tmp/backups
command= sh -c 'mongodump --uri="mongodb://mongo-1:27017/openhim" --gzip --archive=/tmp/backups/mongodump_$(date +%s).gz'
delete= true
```

### Cluster

[Cluster restore docs](https://www.mongodb.com/docs/v4.2/tutorial/restore-replica-set-from-backup/)

The following job may be used to set up a backup job for clustered mongo

```ini
[job-run "mongo-backup"]
schedule= @every 24h
image= mongo:4.2
network= mongo_backup
volume= /backups:/tmp/backups
command= sh -c 'mongodump --uri="mongodb://mongo-1:27017,mongo-2:27017,mongo-3:27017/openhim?replicaSet=mongo-set" --gzip --archive=/tmp/backups/mongodump_$(date +%s).gz'
delete= true
```

### Restore

In order to restore from a backup you would need to launch a mongo container with access to the backup file and the mongo_backup network:

`docker run -d --network=mongo_backup --mount type=bind,source=/backups,target=/backups mongo:4.2`

Then exec into the container and run mongorestore:

`mongorestore --uri="mongodb://mongo-1:27017,mongo-2:27017,mongo-3:27017/openhim?replicaSet=mongo-set" --gzip --archive=/backups/<NAME_OF_BACKUP_FILE>`
